import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Interactable, Interactee, interactionCommand } from "./abilities/Interactable"

export class InteractableObj implements PositionHaver, Interactable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public interactee: Interactee

  constructor(x: number, y: number, spriteKey: string, interactionCommands: interactionCommand[]) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, spriteKey)
    this.sprite.setAlpha(spriteKey === '' ? 0 : 1)
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y)

    this.interactee = new Interactee(this, interactionCommands)
  }
}