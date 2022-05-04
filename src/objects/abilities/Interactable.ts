import { CurrentSceneManager } from "../../managers/CurrentSceneManager"
import { DialogueManager } from "../../managers/DialogueManager"
import { GridMover, MovementCommands } from "./Movable"
import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export type interactionCommand = {
  type: 'dialogue' | 'animation' | 'transition' | 'move' | 'function',
  condition?: {
    var: string,
    value: number,
  },
  dialogue?: {
    type: 'text' | 'choice',
    text?: string[],
    choice?: string[],
    var?: string,
  },
  animation?: string,
  transition?: string,
  move?: MovementCommands,
  function?: () => void
} // TODO: is there a way to enforce whatever data is required via TS?

export class Interactee {
  public parent: Interactable
  private parentSprite: Phaser.GameObjects.Sprite
  private parentMover: GridMover
  private interactionCommands: interactionCommand[]
  private interactVars: { [key: string]: number }

  public constructor(parent: Interactable, interactionCommands: interactionCommand[]) {
    this.parent = parent
    this.parentSprite = parent.sprite
    this.parentMover = (parent as any).mover
    this.interactionCommands = interactionCommands
    this.interactVars = {}
  }
    
  public interact() {
    this.doInteractionStep(0)
  }

  private doInteractionStep = async (step: number) => {
    if (step < this.interactionCommands.length) {
      const cmd = this.interactionCommands[step]
      if (cmd.condition !== undefined && this.interactVars[cmd.condition.var] !== cmd.condition.value) {
        return // skip this step
      }
      switch (cmd.type) {
        case 'dialogue':
          const response = await DialogueManager.getInstance().startDialogue(cmd.dialogue)
          if (response !== undefined) {
            this.interactVars[cmd.dialogue.var] = response
          }
          this.doInteractionStep(step + 1)
          break
        case 'animation':
          this.parentSprite.anims.play(cmd.animation)
          this.parentSprite.on('animationcomplete', () => {
            this.parentSprite.removeListener('animationcomplete')
            this.doInteractionStep(step + 1)
          })
          break
        case 'transition':
          const thisScene = CurrentSceneManager.getInstance().getCurrentScene()
          thisScene.scene.switch(cmd.transition)
          this.doInteractionStep(step + 1) // TODO: should we continue the interaction even when the scene changes?
          break
        case 'move':
          this.parentMover.setMovementCommands(cmd.move)
          this.doInteractionStep(step + 1)
          break
        case 'function':
          cmd.function.bind(this)() // this gives the SCENE access to `public parent`, but should it have this access?
          this.doInteractionStep(step + 1)
          break
        default:
          break
      }
    }
  }
}