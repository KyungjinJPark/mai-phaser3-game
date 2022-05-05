import { CurrentSceneManager } from "../../managers/CurrentSceneManager"
import { DialogueManager } from "../../managers/DialogueManager"
import { Positionable } from "./Positionable"
import { MovementCommands } from "./Movable"
import { BaseObject } from "../BaseObject"

export interface Interactable extends BaseObject, Positionable {
  interactAbility: InteractAbility
}

type dialogueCmd = {
  type: 'dialogue',
  dialogue: {
    type: 'text' | 'choice',
    text?: string[],
    choice?: string[],
    var?: string,
  }
}
type moveCmd = {
  type: 'move',
  move: MovementCommands,
}
type animationCmd = {
  type: 'animation',
  animation: string,
}
type transitionCmd = {
  type: 'transition',
  transition: string,
}
type functionCmd = {
  type: 'function',
  function: () => void
}
export type InteractionCommand = (dialogueCmd | moveCmd | animationCmd | transitionCmd | functionCmd) & {
  condition?: {
    var: string,
    value: number,
  },
}

export class InteractAbility {
  private interactVars: { [key: string]: number } = {}

  public constructor(
    private parent: BaseObject,
    private interactCmds: InteractionCommand[]
  ) {}
    
  public interact() {
    this.doInteractionStep(0)
  }

  private doInteractionStep = async (step: number) => {
    if (step < this.interactCmds.length) {
      const cmd = this.interactCmds[step]
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
          this.parent.sprite.anims.play(cmd.animation) // TODO: assumes sprite exists
          this.parent.gameObject.on('animationcomplete', () => {
            this.parent.gameObject.removeListener('animationcomplete')
            this.doInteractionStep(step + 1)
          })
          break
        case 'transition':
          const thisScene = CurrentSceneManager.scene
          thisScene.scene.switch(cmd.transition)
          this.doInteractionStep(step + 1) // TODO: should we continue the interaction even when the scene changes?
          break
        case 'move':
          this.parent.moveAbility.setMovementCommands(cmd.move) // TODO: assumes parent is Movable
          this.doInteractionStep(step + 1)
          break
        case 'function':
          cmd.function.bind(this.parent)() // this gives the scene access to parent
          this.doInteractionStep(step + 1)
          break
        default:
          break
      }
    }
  }
}