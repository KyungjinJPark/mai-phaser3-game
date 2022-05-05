import { DialogueModalPlugin } from '../plugins/DialogueModal'
import { CurrentSceneManager } from './CurrentSceneManager'
import { TestScene } from '../scenes/TestScene'
import { TestScene2 } from '../scenes/TestScene2'

export class DialogueManager {
  // ======================= singleton code =======================
  private static instance: DialogueManager
  private constructor() {
    DialogueManager.instance = this
  }
  public static getInstance(): DialogueManager {
    if (DialogueManager.instance === undefined) {
      DialogueManager.instance = new DialogueManager()
    }
    return DialogueManager.instance
  }
  // ==============================================================

  private dialoguePlugin: DialogueModalPlugin

  public assignPlugin(dialoguePlugin) {
    this.dialoguePlugin = dialoguePlugin
  }

  public assignHUDScene(hudScene) {
    this.dialoguePlugin.assignHUDScene(hudScene)
  }

  public async startDialogue(dialogue) {
    // stop player movement
    const currScene = CurrentSceneManager.scene
    currScene.inputManager.disableControls()
    // show dialogue
    const ret = await this.dialoguePlugin.startDialogue(dialogue)
    // setup callback on dialogue close
    currScene.inputManager.enableControls()
    // TODO: other callbacks for other events

    return ret
  }
}