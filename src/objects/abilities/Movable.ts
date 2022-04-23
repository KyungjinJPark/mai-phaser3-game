import { GridPhysics } from "../../systems/GridPhysics"
import { Settings } from "../../settings/Settings"
import { Direction } from "../../types/Direction"
import { PositionHaver } from "./PositionHaver"
import { CanMove } from "../../types/CanMove"
import { Collidable } from "../../types/Collidable"

export interface Movable extends PositionHaver {
  mover: GridMover
  initMover(physics: GridPhysics)
}

export type MovementCommand = 'r' | 'u' | 'l' | 'd'

const Vector2 = Phaser.Math.Vector2

export class GridMover {
  private directionVectors: { [key in Direction]: Phaser.Math.Vector2 } = {
    [Direction.NONE]: Vector2.ZERO,
    [Direction.RIGHT]: Vector2.RIGHT,
    [Direction.UP]: Vector2.UP,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.DOWN]: Vector2.DOWN,
  }
  private movementCommandMap: { [key: string]: Direction } = {
    'r': Direction.RIGHT,
    'u': Direction.UP, 
    'l': Direction.LEFT,
    'd': Direction.DOWN,
  }

  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 100 * Settings.zoom
  private pixelsMovedSinceTile = 0
  private facingDirection: Direction = Direction.NONE
  private frozen: boolean

  private movementCommands: MovementCommand[]
  private cmdsIndex = 0

  constructor(
    private parent: Movable,
    private physicsSystem: GridPhysics,
    private spriteKey?: string,
    private isPlayer: boolean = false,
  ) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePosition(delta)
    } else if (this.movementCommands !== undefined) {
      const currMoveDir = this.movementCommandMap[this.movementCommands[this.cmdsIndex]]
      // if (this.canMove(currMoveDir) === CanMove.YES) {
        if (this.tryMove(currMoveDir)) {
          this.cmdsIndex++
          if (this.cmdsIndex >= this.movementCommands.length) {
            this.cmdsIndex = 0
          } 
        }
      // }
    }
    this.movingIntent = Direction.NONE
  }

  // 0: canMove; 1: moving; 2: blocked
  canMove(direction: Direction): CanMove {
    if (this.isMoving()) {
      return CanMove.IS_MOVING
    } else if (this.isCollidableInDir(direction)) {
      return CanMove.COLLIDES
    } else if (this.frozen) {
      return CanMove.FROZEN
    } else {
      return CanMove.YES
    }
  }

  // move alias
  move = this.startMoving

  tryMove(direction: Direction): boolean {
    this.movingIntent = direction
    const canMove = this.canMove(direction)
    switch (canMove) {
      case CanMove.YES:
        this.move(direction)
        return true
        break
      case CanMove.IS_MOVING:
        return false
        break
      case CanMove.COLLIDES:
        this.stopMoving(direction)
        this.frozen = true
        setTimeout(() => {
          this.frozen = false
        }, Math.max(100, 500 - this.movePixelsPerSecond))
        return false
        break
      case CanMove.FROZEN:
        return false
        break
      default:
        throw new Error("Invalid canMove value")
    }
  }
  
  setMovementCommands(movementCommands: MovementCommand[]) {
    this.movementCommands = movementCommands
  }

  isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  tilePosInDir(dir: Direction): Phaser.Math.Vector2 { // TODO: should be in the a PositionHaver class
    return this.parent.beer.getTilePosition().add(this.directionVectors[dir])
  }

  getFacingDirection(): Direction {
    return this.facingDirection
  }

  private startAnimation(direction: Direction) {
    if (this.hasAnimation(direction)) {
      this.parent.sprite.anims.play(`${this.spriteKey}_${direction}`)
    }
  }

  private stopAnimation(direction: Direction) {
    if (this.hasAnimation(direction)) {
      const animForDir = this.parent.sprite.anims.animationManager.get(`${this.spriteKey}_${direction}`)
      const idleFrame = animForDir.frames[1].frame.name
      this.parent.sprite.anims.stop()
      this.parent.sprite.setFrame(idleFrame)
    }
  }

  private hasAnimation(direction: Direction): boolean {
    const animToPlay = `${this.spriteKey}_${direction}`
    return this.parent.sprite.anims.animationManager.exists(animToPlay)
  }

  private startMoving(direction: Direction) {
    this.facingDirection = direction
    this.movingDirection = direction
    this.startAnimation(direction)
    this.updateMovingTilePos()
  }

  private stopMoving(direction?: Direction) {
    if (direction !== undefined) {
      this.stopAnimation(direction)
      this.facingDirection = direction
    } else {
      this.stopAnimation(this.movingDirection)
    }
    this.movingDirection = Direction.NONE
  }

  private updatePosition(delta: number) {
    const deltaInSec = delta / 1000
    const pixelsToMove = deltaInSec * this.movePixelsPerSecond

    if (!this.willCrossBorder(pixelsToMove)) {
      this.moveSprite(pixelsToMove)
    } else if (this.shouldContinueMove()) { // has moving intention
      this.moveSprite(pixelsToMove)
      this.updateMovingTilePos()
    } else {
      this.moveSprite(Settings.tileSize - this.pixelsMovedSinceTile)
      this.stopMoving()
    }
  }
  
  private moveSprite(pixelsToMove: number) { // should this have a reference to parent?
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.parent.beer.getPosition().add(moveVect.scale(pixelsToMove))
    this.pixelsMovedSinceTile += pixelsToMove
    this.pixelsMovedSinceTile %= Settings.tileSize
    this.parent.beer.setPosition(newPos)
  }
  
  private willCrossBorder(pixelsToMove: number): boolean {
    return this.pixelsMovedSinceTile + pixelsToMove >= Settings.tileSize
  }

  private shouldContinueMove() {
    return (
      this.movingIntent === this.movingDirection &&
      !this.isCollidableInDir(this.movingDirection)
    )
  }
  
  private isCollidableInDir(dir: Direction): boolean {
    const types = this.physicsSystem.getCollisionTypesAt(this.tilePosInDir(dir))
    if (types.includes(Collidable.YES)) {
      return true
    }
    if (this.isPlayer) {
      if (types.includes(Collidable.TO_PLAYERS)) {
        return true
      }
    } else {
      if (types.includes(Collidable.TO_NON_PLAYERS)) {
        return true
      }
    }
    return false
  }

  private updateMovingTilePos() {
    this.parent.beer.setTilePosition(
      this.parent.beer.getTilePosition().add(this.directionVectors[this.movingDirection])
    )
  }
}