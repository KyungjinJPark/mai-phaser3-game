import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Interactable, Interactee } from "./abilities/Interactable"

export class Photo implements PositionHaver, Interactable {
  // TODO: it might be a bit much if I have to make a new class for every object I make
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public interactee: Interactee

  constructor(x: number, y: number) {
    const currScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = currScene.add.sprite(0, 0, 'photo')
    this.sprite.setDepth(20)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y)

    this.interactee = { // TODO: construct interactee based on interactionCmds
      interact: () => {
        // destroy self and beer
        this.sprite.destroy()
        this.beer.destroy() // makes an assumption that all things with positions will be registered with the ObjectManager
        // change save file json
        const sf = currScene.cache.json.get('saveFile')
        sf.TestScene_hasPhoto = false
        sf.inventory.push('photo')
        currScene.cache.json.add('saveFile', sf)
      }
    }
  }
}