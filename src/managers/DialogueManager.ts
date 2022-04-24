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
    this.dialoguePlugin.HUD_SCENE = hudScene
  }

  public async showDialogue(message: string) {
    // stop player movement
    const currScene = CurrentSceneManager.getInstance().getCurrentScene() as (TestScene | TestScene2) // TODO: ASSUMES SCENE TYPE FOR NOW
    currScene.inputManager.disableControls()
    // show dialogue
    const promise = this.dialoguePlugin.createDialogue(message)
    // setup callback on dialogue close
    await promise
    currScene.inputManager.enableControls()
    // TODO: other callbacks for other events
  }
}