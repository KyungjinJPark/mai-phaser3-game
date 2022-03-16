import { GridPhysics } from "../../systems/GridPhysics"
import { Settings } from "../../settings/Settings"
import { Direction } from "../../types/Direction"
import { Beer } from "./PositionHaver"
import { CanMove } from "../../types/CanMove"

export interface Movable {
  beer: Beer // TODO: should use the Type instead of this (like `interface Movable = { ... } & PositionHaver`)
  mover: GridMover
  initMover(physics: GridPhysics)
}
  
const Vector2 = Phaser.Math.Vector2

export class GridMover {
  private directionVectors: { [key in Direction]: Phaser.Math.Vector2 } = {
    [Direction.NONE]: Vector2.ZERO,
    [Direction.RIGHT]: Vector2.RIGHT,
    [Direction.UP]: Vector2.UP,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.DOWN]: Vector2.DOWN,
  }

  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 100 * Settings.getZoom()
  private pixelsMovedSinceTile = 0
  private facingDirection: Direction = Direction.NONE

  private movementCommands: any[]
  private cmdsIndex = 0
  frozen: boolean

  constructor(
    private parent: any, // TODO: this seems like bad practice // any -> GameObject
    private physicsSystem: GridPhysics,
    private spriteKey?: string
  ) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePosition(delta)
    }
    if (this.movementCommands !== undefined) {
      switch (this.movementCommands[this.cmdsIndex]) {
        case 'r':
          if (this.tryMove(Direction.RIGHT)) {
            this.cmdsIndex++
          }
          break
        case 'u':
          if (this.tryMove(Direction.UP)) {
            this.cmdsIndex++
          }
          break
        case 'l':
          if (this.tryMove(Direction.LEFT)) {
            this.cmdsIndex++
          }
          break
        case 'd':
          if (this.tryMove(Direction.DOWN)) {
            this.cmdsIndex++
          }
          break
        default:
          break
      }
      if (this.cmdsIndex >= this.movementCommands.length) {
        this.cmdsIndex = 0
      }
    }
    this.movingIntent = Direction.NONE
  }

  // 0: canMove; 1: moving; 2: blocked
  canMove(direction: Direction): CanMove {
    if (this.isMoving()) {
      return CanMove.IS_MOVING
    } else if (this.isBlockedInDir(direction)) {
      return CanMove.COLLIDES
    } else if (this.frozen) {
      return CanMove.FROZEN
    } else {
      return CanMove.YES
    }
  }

  move(direction: Direction) {
    this.startMoving(direction)
    this.facingDirection = direction
  }

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
        this.stopAnimation(direction) // TODO: assumes animation exists // does this check even have to exist?
        this.frozen = true
        setTimeout(() => {
          this.frozen = false
        }, Math.max(100, 500 - this.movePixelsPerSecond));
        this.facingDirection = direction
        return false
        break
      case CanMove.FROZEN:
        return false
        break
      default:
        throw new Error("Invalid canMove value")
    }
  }
  
  setMovementCommands(movementCommands: any[]) {
    this.movementCommands = movementCommands
  }

  isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  tilePosInDir(dir: Direction): Phaser.Math.Vector2 { // TODO: should be in the a PositionHaver class
    return this.parent.beer.getTilePosition().add(this.directionVectors[dir])
  }

  getFacingDirection(): Direction {  // TODO: this is only public because the player
    return this.facingDirection
  }

  startAnimation(direction: Direction) {
    this.parent.sprite.anims.play(`${this.spriteKey}_${direction}`)
  }

  stopAnimation(direction: Direction) {
    const animForDir = this.parent.sprite.anims.animationManager.get(`${this.spriteKey}_${direction}`)
    const idleFrame = animForDir.frames[1].frame.name
    this.parent.sprite.anims.stop()
    this.parent.sprite.setFrame(idleFrame)
  }

  private startMoving(direction: Direction) {
    this.startAnimation(direction) // TODO: assumes animation exists
    this.movingDirection = direction
    this.updatePlayerTilePos()
  }

  private stopMoving() {
    this.stopAnimation(this.movingDirection) // TODO: assumes animation exists
    this.movingDirection = Direction.NONE
  }

  private updatePosition(delta: number) {
    const deltaInSec = delta / 1000
    const pixelsToMove = deltaInSec * this.movePixelsPerSecond

    if (!this.willCrossBorder(pixelsToMove)) {
      this.moveSprite(pixelsToMove)
    } else if (this.shouldContinueMove()) { // has moving intention
      this.moveSprite(pixelsToMove)
      this.updatePlayerTilePos()
    } else {
      this.moveSprite(Settings.getTileSize() - this.pixelsMovedSinceTile)
      this.stopMoving()
    }
  }
  
  private willCrossBorder(pixelsToMove: number): boolean {
    return this.pixelsMovedSinceTile + pixelsToMove >= Settings.getTileSize()
  }

  private moveSprite(pixelsToMove: number) { // should this have a reference to parent?
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.parent.beer.getPosition().add(moveVect.scale(pixelsToMove))
    this.pixelsMovedSinceTile += pixelsToMove
    this.pixelsMovedSinceTile %= Settings.getTileSize()
    this.parent.beer.setPosition(newPos)
  }

  private shouldContinueMove() {
    return (
      this.movingIntent === this.movingDirection &&
      !this.isBlockedInDir(this.movingDirection)
    )
  }
  
  private isBlockedInDir(dir: Direction): boolean { // TODO: should be in GridPhysics. Movers should ask if they can move then move with confidence
    return this.physicsSystem.hasCollisionTileAt(this.tilePosInDir(dir))
  }

  private updatePlayerTilePos() {
    this.parent.beer.setTilePosition(
      this.parent.beer.getTilePosition().add(this.directionVectors[this.movingDirection])
    )
  }
}