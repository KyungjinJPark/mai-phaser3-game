import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Interactable, Interactee } from "./abilities/Interactable"

export class Sign implements PositionHaver, Interactable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public interactee: Interactee
  private dialogueManager: DialogueManager

  constructor(x: number, y: number, message: string) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, '') // no image
    this.sprite.setAlpha(0)
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    this.dialogueManager = DialogueManager.getInstance()
    this.interactee = { // TODO: construct interactee based on interactionCmds
      interact: () => {
        this.dialogueManager.showDialogue(message)
      }
    }
  }
}