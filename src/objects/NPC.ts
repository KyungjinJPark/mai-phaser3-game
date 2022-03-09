import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Movable, GridMover } from "./Movable"
import { Direction } from "../types/Direction" // Porb shouldn't be a dependency

export class NPC implements Movable {
  public mover: GridMover = null
  
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
    if (this.mover !== null) { // TODO: what if I want NPCs that can't move?, Not all NPCs should have to do this check. prob shouldn't even import Movable
      // create a number 0 to 999
      const randomNumber = Math.floor(Math.random() * 1000)
      switch (randomNumber) {
        case 0:
          //trigger a move right
          this.mover.tryMove(Direction.RIGHT)
          break
        case 1:
          //trigger a move up
          this.mover.tryMove(Direction.UP)
          break
        case 2:
          //trigger a move left
          this.mover.tryMove(Direction.LEFT)
          break
        case 3:
          //trigger a move down
          this.mover.tryMove(Direction.DOWN)
          break
        default:
          break
      }
    }
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics)
  }

  // WET code
  /**
   * TODO: animations should be a Movable class thing
   */
  startAnimation(direction: Direction) {}

  stopAnimation(direction: Direction) {}
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