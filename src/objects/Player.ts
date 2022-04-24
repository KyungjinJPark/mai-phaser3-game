import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"

export class Player implements PositionHaver, Movable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public mover: GridMover
  private spriteKey: string
  private gridPhysics: GridPhysics

  constructor(x: number, y: number, spriteKey: string) {
    this.spriteKey = spriteKey
    this.sprite = CurrentSceneManager.getInstance().getCurrentScene().add.sprite(0, 0, spriteKey, 1)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y)
    this.mover = new GridMover(this, this.spriteKey, true)
  }

  update(delta: number) {
    this.mover.update(delta)
  }

  tryInteract() {
    if (!this.mover.isMoving()) {
      const interactSpot = this.mover.tilePosInDir(this.mover.getFacingDirection())
      const interactable = this.beer.getObjManager().getInteractableAt(interactSpot)
      if (interactable !== undefined) {
        interactable.interactee.interact()
      }
    }
  }

  getSprite() { // TODO: remove this
    return this.sprite
  }
}