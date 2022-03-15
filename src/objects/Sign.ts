import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Interactable, Interactee } from "./abilities/Interactable"

export class Sign implements PositionHaver, Interactable {
  public beer: Beer
  public interactee: Interactee

  private dialogueManager: DialogueManager
  private sprite: Phaser.GameObjects.Sprite
  private tilePos: Phaser.Math.Vector2

  constructor(x: number, y: number, message: string) {
    // TODO: consider: sprites need to be created before being
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, '') // no image
    this.sprite.setAlpha(0)
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.getZoom()
    this.beer = new Beer(this, x, y)
    
    this.dialogueManager = DialogueManager.getInstance()
    this.interactee = {
      interact: () => {
        this.dialogueManager.showDialogue(message)
      }
    }
  }
}