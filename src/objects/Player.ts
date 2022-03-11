import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Movable, GridMover } from "./Movable"

export class Player implements Movable {
  public mover: GridMover = null

  private tempGridPhysicsMaybeMakeInteractorClass // TODO: read variable name

  constructor(
    private sprite: Phaser.GameObjects.Sprite, // TODO: should be in a GameObject class
    private tilePos: Phaser.Math.Vector2,
  ) {
    const offsetX = Settings.getTileSize() / 2
    const offsetY = Settings.getTileSize() // what are these for?

    this.sprite.setOrigin(0.5, 1)
    this.sprite.setPosition(
      tilePos.x * Settings.getTileSize() + offsetX,
      tilePos.y * Settings.getTileSize() + offsetY
    )
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics)


    this.tempGridPhysicsMaybeMakeInteractorClass = gridPhysics


  }

  tryInteract() {
    if (!this.mover.isMoving()) {
      const interactable = this.tempGridPhysicsMaybeMakeInteractorClass.getInteractableAt(this.mover.tilePosInDir(this.mover.getFacingDirection())) // TODO: should this be here?
      if (interactable !== undefined) {
        interactable.interactee.interact()
      }
    }
  }

  // WET code
  /**
   * TODO: animations should be a Movable class thing
   */
  startAnimation(direction: Direction) {
    this.sprite.anims.play(direction)
  }

  stopAnimation(direction: Direction) {
    const animForDir = this.sprite.anims.animationManager.get(direction)
    const idleFrame = animForDir.frames[1].frame.name
    this.sprite.anims.stop()
    this.sprite.setFrame(idleFrame)
  }
  /**
   * ==================== END =========================
   */

  /**
   * TODO: should all be moved ot to a PositionHaver class 
   */
  getPosition() {
    return this.sprite.getBottomCenter()
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setPosition(pos: Phaser.Math.Vector2) {
    this.sprite.setPosition(pos.x, pos.y)
  }

  setTilePosition(pos: Phaser.Math.Vector2) {
    this.tilePos = pos.clone()
  }
  /**
   * ==================== END =========================
   */
}