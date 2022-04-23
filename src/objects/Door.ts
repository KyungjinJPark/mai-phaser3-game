import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Interactable, Interactee } from "./abilities/Interactable"

export class Door implements PositionHaver, Interactable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public interactee: Interactee

  constructor(x: number, y: number, sceneName: string) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, '') // no image
    this.sprite.setAlpha(0)
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y)

    this.interactee = { // TODO: construct interactee based on interactionCmds
      interact: () => {
        currScene.scene.switch(sceneName) // TODO: should scene changing be here
      }
    }
  }
}