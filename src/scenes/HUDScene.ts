import { CurrentSceneManager } from "../managers/CurrentSceneManager"

const hudSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'HUDScene',
}

export class HUDScene extends Phaser.Scene {
  private gamePaused: boolean = false
  private pauseUI = []

  constructor () {
    super(hudSceneConfig)
  }

  create () {
    this.scene.bringToTop()

    // Create pause UI
    const w = this.game.scale.width
    const h = this.game.scale.height
    this.pauseUI.push(this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5))
    this.pauseUI.push(this.add.text(10, h / 2, 'Paused', { fontSize: '32px' }))
    this.pauseUI.push(this.add.text(10, h / 2 + 32, '', { fontSize: '16px' })) // for inventory items
    this.hidePauseUI()

    // Pause game
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      const gameScene = CurrentSceneManager.getInstance().getCurrentScene().scene
      if (!this.gamePaused) {
        // new Phaser.Events.EventEmitter()
        this.showPauseUI()
        gameScene.pause()
      } else {
        this.hidePauseUI()
        gameScene.resume()
      }
      this.gamePaused = !this.gamePaused
    })
  }

  private showPauseUI () {
    this.pauseUI[2].setText('Items: ' + JSON.stringify(this.cache.json.get('saveFile').inventory))
    this.pauseUI.forEach(g => g.setVisible(true))
  }

  private hidePauseUI () {
    this.pauseUI.forEach(g => g.setVisible(false))
  }
}