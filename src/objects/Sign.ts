import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { Settings } from "../settings/Settings"
import { Interactable, Interactee } from "./Interactable"

export class Sign implements Interactable {
  private dialogueManager: DialogueManager

  public interactee: Interactee
  private sprite: Phaser.GameObjects.Sprite
  private tilePos: Phaser.Math.Vector2

  constructor(x: number, y: number, message: string) {
    this.dialogueManager = DialogueManager.getInstance()
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, '') // no image
    this.sprite.setAlpha(0)
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.getZoom()
    this.interactee = {
      interact: () => {
        this.dialogueManager.showDialogue(message)
      }
    }

    const offsetX = Settings.getTileSize() / 2
    const offsetY = Settings.getTileSize() // what are these for?

    
    this.sprite.setOrigin(0.5, 1)
    this.sprite.setPosition(
      x * Settings.getTileSize() + offsetX,
      y * Settings.getTileSize() + offsetY
    )

    this.tilePos = new Phaser.Math.Vector2(x, y)
  }

  /**
   * TODO: should all be moved ot to a PositionHaver class 
   */
   getPosition() {
    return this.sprite.getBottomCenter()
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setPosition(pos: Phaser.Math.Vector2) {
    this.sprite.setPosition(pos.x, pos.y)
  }

  setTilePosition(pos: Phaser.Math.Vector2) {
    this.tilePos = pos.clone()
  }
  /**
   * ==================== END =========================
   */
}