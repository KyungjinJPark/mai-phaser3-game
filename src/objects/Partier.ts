import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { Collidable } from "../types/Collidable"

export class Partier implements PositionHaver, Movable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public mover: GridMover
  private spriteKey: string

  constructor(x: number, y: number, spriteKey: string) {
    this.spriteKey = spriteKey
    this.sprite = CurrentSceneManager.getInstance().getCurrentScene().add.sprite(0, 0, spriteKey, 1)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y, Collidable.TO_NON_PLAYERS)
  }

  update(delta: number) {
    this.mover.update(delta)
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics, this.spriteKey)
  }
}