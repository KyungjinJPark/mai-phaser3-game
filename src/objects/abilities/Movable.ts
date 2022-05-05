import { Settings } from "../../settings/Settings"
import { Direction } from "../../types/Direction"
import { Collidability } from "../../types/Collidability"
import { CanMove } from "../../types/CanMove"
import { Positionable } from "./Positionable"
import { BaseObject } from "../BaseObject"

const Vector2 = Phaser.Math.Vector2 // alias. TODO: should I use a namespace?

export interface Movable extends BaseObject, Positionable {
  moveAbility: MoveAbility
}

export type MovementCommands = {
  instructions: ('r' | 'u' | 'l' | 'd')[],
  loop: boolean,
}

export class MoveAbility {
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
  private frozen: boolean = false

  private moveCmdsLoopCount = 0
  private cmdsIndex = 0

  public constructor(
    private parent: BaseObject,
    private animated: boolean,
    private imageKey?: string,
    private isPlayer: boolean = false,
    private moveCmds?: MovementCommands
  ) {}

  public update(delta: number) {
    if (this.isMoving()) {
      this.updatePosition(delta)
    } else if (this.moveCmds !== undefined) {
      // if there are movement commands to do, do them
      if (this.moveCmds.loop || this.moveCmdsLoopCount == 0) {
        const currMoveDir = this.movementCommandMap[this.moveCmds.instructions[this.cmdsIndex]]
        // try to move, and if you succeed, increment the move index
        if (this.tryMove(currMoveDir)) {
          this.cmdsIndex++
          if (this.cmdsIndex >= this.moveCmds.instructions.length) {
            this.moveCmdsLoopCount++
            this.cmdsIndex = 0
          } 
        }
      }
    }
    this.movingIntent = Direction.NONE
  }

  public move(direction: Direction) {
    this.facingDirection = direction
    this.movingDirection = direction
    this.startAnimation(direction)
    this.updateTilePos()
  }

  public canMove(direction: Direction): CanMove {
    if (this.isMoving()) {
      return CanMove.IS_MOVING
    } else if (this.frozen) {
      return CanMove.FROZEN
    } else if (this.isCollidableInDir(direction)) {
      return CanMove.COLLIDES
    }
    return CanMove.YES
  }

  public tryMove(direction: Direction): boolean {
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
        }, Math.max(100, 500 - this.movePixelsPerSecond)) // TODO: havent yet conceptualized how movespeed works
        return false
        break
      case CanMove.FROZEN:
        return false
        break
      default:
        throw new Error("Invalid canMove value")
    }
  }
  
  public setMovementCommands(movementCommands: MovementCommands) {
    this.moveCmds = movementCommands
    this.moveCmdsLoopCount = 0
    this.cmdsIndex = 0
  }

  public isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  public tilePosInDir(dir: Direction): Phaser.Math.Vector2 { // TODO: should be in the a PositionHaver class
    return this.parent.positionAbility.tilePos.add(this.directionVectors[dir])
  }

  public getFacingDirection(): Direction {
    return this.facingDirection
  }

  private startAnimation(direction: Direction) {
    if (this.hasAnimation(direction)) {
      this.parent.sprite.anims.play(`${this.imageKey}_${direction}`)
    }
  }

  private stopAnimation(direction: Direction) {
    if (this.hasAnimation(direction)) {
      const sprite = this.parent.sprite
      const animForDir = sprite.anims.animationManager.get(`${this.imageKey}_${direction}`)
      const idleFrame = animForDir.frames[1].frame.name
      sprite.anims.stop()
      this.parent.gameObject.setFrame(idleFrame)
    }
  }

  private hasAnimation(direction: Direction): boolean {
    if (!this.animated) {
      return false
    }
    const animToPlay = `${this.imageKey}_${direction}`
    return this.parent.sprite.anims.animationManager.exists(animToPlay)
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
      this.updateTilePos()
    } else {
      this.moveSprite(Settings.tileSize - this.pixelsMovedSinceTile)
      this.stopMoving()
    }
  }
  
  private moveSprite(pixelsToMove: number) { // should this have a reference to parent?
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.parent.positionAbility.gamePos.add(moveVect.scale(pixelsToMove))
    this.pixelsMovedSinceTile += pixelsToMove
    this.pixelsMovedSinceTile %= Settings.tileSize
    this.parent.positionAbility.gamePos = newPos
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
    const types = this.parent.objManager.getCollidabilityAt(this.tilePosInDir(dir))
    if (types.includes(Collidability.YES)) {
      return true
    }
    if (this.isPlayer) {
      if (types.includes(Collidability.TO_PLAYERS)) {
        return true
      }
    } else {
      if (types.includes(Collidability.TO_NON_PLAYERS)) {
        return true
      }
    }
    return false
  }

  private updateTilePos() {
    this.parent.positionAbility.tilePos = (
      this.parent.positionAbility.tilePos.add(this.directionVectors[this.movingDirection])
    )
  }
}