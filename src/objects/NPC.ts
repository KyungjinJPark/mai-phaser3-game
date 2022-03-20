import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { GridPhysics } from "../systems/GridPhysics"
import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover, MovementCommand } from "./abilities/Movable"
import { Interactable, Interactee, interactionCommand } from "./abilities/Interactable"

export class NPC implements PositionHaver, Movable, Interactable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public mover: GridMover
  public interactee: Interactee
  private spriteKey: string 
  
  constructor(x: number, y: number, spriteKey: string, interactionCommands?: interactionCommand[], private movementCommands?: MovementCommand[]) {
    this.spriteKey = spriteKey
    this.sprite = CurrentSceneManager.getInstance().getCurrentScene().add.sprite(0, 0, spriteKey, 55)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    // Implement these interaction Commands and Movement Commands
    const dm = DialogueManager.getInstance()
    this.interactee = {
      interact: () => {
        interactionCommands.forEach(cmd => { // TODO: construct interactee based on interactionCmds
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
    this.mover = new GridMover(this, gridPhysics, this.spriteKey)
    this.mover.setMovementCommands(this.movementCommands)
  }
}