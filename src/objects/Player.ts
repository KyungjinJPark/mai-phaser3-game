import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"

export class Player implements PositionHaver, Movable {
  public beer: Beer
  public mover: GridMover
  private sprite: Phaser.GameObjects.Sprite
  private gridPhysics: GridPhysics

  constructor(x: number, y: number, spriteKey: string,) {
    this.beer = new Beer(this, x, y)
    this.sprite = CurrentSceneManager.getInstance().getCurrentScene().add.sprite(0, 0, spriteKey, 1)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.getZoom()
  }

  update(delta: number) {
    this.mover.update(delta)
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics)
    this.gridPhysics = gridPhysics
  }

  tryInteract() {
    if (!this.mover.isMoving()) {
      const interactable = this.gridPhysics.getInteractableAt(this.mover.tilePosInDir(this.mover.getFacingDirection())) // TODO: should this be here?
      if (interactable !== undefined) {
        interactable.interactee.interact()
      }
    }
  }

  getSprite() {
    return this.sprite
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