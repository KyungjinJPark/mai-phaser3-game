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
    const thisScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = thisScene.add.sprite(0, 0, spriteKey, 55)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    // Implement these interaction Commands and Movement Commands
    const dm = DialogueManager.getInstance()

    const doInteractionStep =  async (step: number) => {
      if (step < interactionCommands.length) {
        const cmd = interactionCommands[step]
        switch (cmd.type) {
          case 'dialogue':
            dm.showDialogue(cmd.dialogue)
            doInteractionStep(step + 1)
            break
          case 'animation':
            this.sprite.anims.play(cmd.animation)
            this.sprite.on('animationcomplete', () => {
              this.sprite.on('animationcomplete', () => {})
              doInteractionStep(step + 1)
            })
            break
          case 'transition':
            thisScene.scene.switch(cmd.transition)
            doInteractionStep(step + 1)
            break
          case 'function':
            cmd.function()
            doInteractionStep(step + 1)
            break
          default:
            break
        }
      }
    }

    this.interactee = {
      interact: () => {
        doInteractionStep(0)
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