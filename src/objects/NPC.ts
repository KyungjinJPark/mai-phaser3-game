import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Movable, GridMover } from "./Movable"

export class NPC implements Movable {
  public mover = null
  
  constructor( // TODO: wet code
    private sprite: Phaser.GameObjects.Sprite,
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

  update(delta: number) {
    // create a number 0 to 19
    const randomNumber = Math.floor(Math.random() * 20)
    switch (randomNumber) {
      case 0:
        //trigger a move right
        break
      case 1:
        //trigger a move up
        break
      case 2:
        //trigger a move left
        break
      case 3:
        //trigger a move down
        break
      default:
        break
    }
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics)
  }
}