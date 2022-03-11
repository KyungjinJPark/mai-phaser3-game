import { DialogueModalPlugin } from '../plugins/DialogueModal';

export class DialogueManager {
  // Singleton code
  private static instance: DialogueManager
  public static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      throw new Error("singleton instance does not exist")
      // DialogueManager.singleton = new DialogueManager()
    }
    return DialogueManager.instance
  }

  private dialoguePlugin: DialogueModalPlugin

  constructor(that: Phaser.Scene) {
    // load the DialogueModalPlugin
    this.dialoguePlugin = that.plugins.get('DialogueModalPlugin') as any

    // launch the HUD Scene
    if (!that.scene.isActive('HUDScene')) {
      that.scene.launch('HUDScene')
    }

    DialogueManager.instance = this
  }

  showDialogue(message: string) {
    this.dialoguePlugin.createDialogue(message)
  }
}