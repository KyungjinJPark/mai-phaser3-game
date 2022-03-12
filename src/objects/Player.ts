import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Beer } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"

export class Player implements Movable {
  public beer: Beer
  public mover: GridMover

  private tempGridPhysicsMaybeMakeInteractorClass // TODO: read variable name

  constructor(x, y,
    private sprite: Phaser.GameObjects.Sprite, // TODO: should be in a GameObject class
  ) {
    this.beer = new Beer(this, x, y)
  }

  update(delta: number) {
    this.mover.update(delta)
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
}