import { CurrentSceneManager } from "../managers/CurrentSceneManager"

const hudSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'HUDScene',
}

export class HUDScene extends Phaser.Scene {
  private graphics = []

  constructor () {
    super(hudSceneConfig)
  }

  create () {
    this.scene.bringToTop()

    // paused game graphics TODO: Seems very messy and slow
    const w = this.game.scale.width
    const h = this.game.scale.height
    this.graphics.push(this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5))
    this.graphics.push(this.add.text(w / 2, h / 2, 'Paused', { fontSize: '32px' }))
    // set all graphics to invisible
    this.graphics.forEach(g => g.setVisible(false))
    
    // Resume game
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      // new Phaser.Events.EventEmitter()
      const gameScene = CurrentSceneManager.getInstance().getCurrentScene().scene
      if (gameScene.isPaused()) {
        gameScene.resume()
      }
    })
  }

  update () {
    if (CurrentSceneManager.getInstance().getCurrentScene().scene.isPaused()) {
      this.graphics.forEach(g => g.setVisible(true))
    } else {
      this.graphics.forEach(g => g.setVisible(false))
    }
  }
}