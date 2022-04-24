import { DialogueModalPlugin } from '../plugins/DialogueModal'
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
    CurrentSceneManager.getInstance().getCurrentScene().input.keyboard.enabled = false // TODO: this might be a hack
    // show dialogue
    const promise = this.dialoguePlugin.createDialogue(message)
    // setup callback on dialogue close
    await promise
    CurrentSceneManager.getInstance().getCurrentScene().input.keyboard.enabled = true
    // TODO: other callbacks for other events
  }
}