import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"

export interface Movable {
  mover: GridMover


  getTilePosition() // should be `beer: positionHaver`


  initMover(physics: GridPhysics)
}
  
const Vector2 = Phaser.Math.Vector2

export class GridMover {
  private directionVectors: { [key in Direction]: Phaser.Math.Vector2 } = { // TODO: this could be already implemented officially
    [Direction.NONE]: new Vector2(0, 0),
    [Direction.RIGHT]: new Vector2(1, 0),
    [Direction.UP]: new Vector2(0, -1),
    [Direction.LEFT]: new Vector2(-1, 0),
    [Direction.DOWN]: new Vector2(0, 1)
  }

  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 350
  private pixelsMovedSinceTile = 0
  private facingDirection: Direction = Direction.NONE

  constructor(
    private parent: any, // TODO: this seems like bad practice // any -> GameObject
    private physicsSystem: GridPhysics
  ) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePosition(delta)
    }
    this.movingIntent = Direction.NONE
  }

  tryMove(direction: Direction) {
    this.movingIntent = direction
    if (this.isMoving()) {
      return
    } else if (this.isBlockedInDir(direction)) {
      this.parent.stopAnimation(direction) // TODO: assumes animation exists // does this check even have to exist?
      this.facingDirection = direction
    } else {
      this.startMoving(direction)
      this.facingDirection = direction
    }
  }
  
  isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  tilePosInDir(dir: Direction): Phaser.Math.Vector2 { // TODO: should be in the a PositionHaver class
    return this.parent.getTilePosition().add(this.directionVectors[dir])
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
    const newPos = this.parent.getPosition().add(moveVect.scale(pixelsToMove))
    this.pixelsMovedSinceTile += pixelsToMove
    this.pixelsMovedSinceTile %= Settings.getTileSize()
    this.parent.setPosition(newPos)
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
    this.parent.setTilePosition(
      this.parent.getTilePosition().add(this.directionVectors[this.movingDirection])
    )
  }
}