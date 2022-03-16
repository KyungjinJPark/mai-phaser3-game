import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover } from "./abilities/Movable"
import { Interactable, Interactee } from "./abilities/Interactable"

export class NPC implements PositionHaver, Movable, Interactable {
  public beer: Beer
  public mover: GridMover
  public interactee: Interactee

  private sprite: Phaser.GameObjects.Sprite
  
  constructor(x: number, y: number, spriteKey: string, interactionCommands?: any[], private movementCommands?: any[]) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, spriteKey, 55)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    // Implement these interaction Commands and Movement Commands
    const dm = DialogueManager.getInstance()
    this.interactee = {
      interact: () => {
        interactionCommands.forEach(cmd => {
          switch (cmd.type) {
            case 'dialogue':
              dm.showDialogue(cmd.msg)
              break
            default:
              break
          }
        })
      }
    }
  }

  update(delta: number) {
    if (this.mover !== undefined) {
      this.mover.update(delta)
    }
  }

  initMover(gridPhysics: GridPhysics) {
    this.mover = new GridMover(this, gridPhysics)
    this.mover.setMovementCommands(this.movementCommands)
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
}