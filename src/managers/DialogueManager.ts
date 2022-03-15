import { DialogueModalPlugin } from '../plugins/DialogueModal';

export class DialogueManager {
  // Singleton code
  private static instance: DialogueManager
  public static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      DialogueManager.instance = new DialogueManager()
    }
    return DialogueManager.instance
  }

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

  showDialogue(message: string) {
    this.dialoguePlugin.createDialogue(message)
  }
}