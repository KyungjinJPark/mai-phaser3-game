import { GridPhysics } from "../../systems/GridPhysics"
import { Settings } from "../../settings/Settings"
import { Direction } from "../../types/Direction"
import { Beer } from "./PositionHaver"

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
  private movePixelsPerSecond: number = 350
  private pixelsMovedSinceTile = 0
  private facingDirection: Direction = Direction.NONE

  private movementCommands: any[]
  private cmdsIndex = 0

  constructor(
    private parent: any, // TODO: this seems like bad practice // any -> GameObject
    private physicsSystem: GridPhysics
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

  tryMove(direction: Direction): boolean {
    this.movingIntent = direction
    if (this.isMoving()) {
      return false
    } else if (this.isBlockedInDir(direction)) {
      this.parent.stopAnimation(direction) // TODO: assumes animation exists // does this check even have to exist?
      this.facingDirection = direction
      return false
    } else {
      this.startMoving(direction)
      this.facingDirection = direction
      return true
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

  private startMoving(direction: Direction) {
    this.parent.startAnimation(direction) // TODO: assumes animation exists
    this.movingDirection = direction
    this.updatePlayerTilePos()
  }

  private stopMoving() {
    this.parent.stopAnimation(this.movingDirection) // TODO: assumes animation exists
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