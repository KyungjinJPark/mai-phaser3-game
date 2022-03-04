import { DialogueModalPlugin } from '../plugins/DialogueModal';

export class DialogueManager {
  private dialoguePlugin: DialogueModalPlugin

  constructor(that) {
    // load the DialogueModalPlugin
    this.dialoguePlugin = that.plugins.get('DialogueModalPlugin') as any

    // launch the HUD Scene
    if (!that.scene.isActive('HUDScene')) {
      that.scene.launch('HUDScene')
    }
  }

  showDialogue(message: string) {
    this.dialoguePlugin.createDialogue(message)
  }
}