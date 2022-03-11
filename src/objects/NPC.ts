import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction" // TODO: consider: maybe shouldn't be a dependency
import { Beer } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"
import { Interactable, Interactee } from "./abilities/Interactable"

export class NPC implements Movable, Interactable {
  public beer: Beer
  public mover: GridMover
  public interactee: Interactee

  private sprite: Phaser.GameObjects.Sprite
  private tilePos: Phaser.Math.Vector2
  
  constructor(x: number, y: number, spriteKey: string) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, spriteKey, 55)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    const dm = DialogueManager.getInstance()
    this.interactee = {
      interact: () => {
        dm.showDialogue('Hello!')
      }
    }
  }

  update(delta: number) {
    if (this.mover !== undefined) { // TODO: what if I want NPCs that can't move?, Not all NPCs should have to do this check. prob shouldn't even import Movable
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
  startAnimation(direction: Direction) {
    this.sprite.anims.play(`npc_${direction}`)}

  stopAnimation(direction: Direction) {
    const animForDir = this.sprite.anims.animationManager.get(`npc_${direction}`)
    const idleFrame = animForDir.frames[1].frame.name
    this.sprite.anims.stop()
    this.sprite.setFrame(idleFrame)}
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