import { DialogueModalPlugin } from '../plugins/DialogueModal';

/**
 * TODO: The dialogue manager existing doesn't require a HUD Scene to have already been created.
 */
export class DialogueManager {
  private dialoguePlugin: DialogueModalPlugin

  constructor(that) {
    // load the DialogueModalPlugin
    this.dialoguePlugin = that.plugins.get('DialogueModalPlugin') as any
  }

  showDialogue(message: string) {
    this.dialoguePlugin.createDialogueBox()
    this.dialoguePlugin.setText(message, true)
  }
}