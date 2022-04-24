import { DialogueModalPlugin } from '../plugins/DialogueModal'
import { TestScene } from '../scenes/TestScene'
import { TestScene2 } from '../scenes/TestScene2'
import { CurrentSceneManager } from './CurrentSceneManager'

export class DialogueManager {
  // ======================= singleton code =======================
  private static instance: DialogueManager
  public static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      DialogueManager.instance = new DialogueManager()
    }
    return DialogueManager.instance
  }
  // ==============================================================

  private dialoguePlugin: DialogueModalPlugin

  private constructor() {
    DialogueManager.instance = this
  }

  init(scene: Phaser.Scene) {
    // launch the HUD Scene
    if (!scene.scene.isActive('HUDScene')) {
      scene.scene.launch('HUDScene')
    }
    // load the DialogueModalPlugin
    this.dialoguePlugin = scene.plugins.get('DialogueModalPlugin') as any
  }

  async showDialogue(message: string) {
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