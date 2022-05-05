import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"

const hudSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'HUDScene',
}

export class HUDScene extends Phaser.Scene {
  private gamePaused: boolean = false
  private pauseUI = []

  public constructor() {
    super(hudSceneConfig)
  }

  public create() {
    this.scene.bringToTop()

    // assign this scene to dialogue manager's HUD scene
    DialogueManager.getInstance().assignHUDScene(this)

    // Create pause UI
    const w = this.game.scale.width
    const h = this.game.scale.height
    this.pauseUI.push(this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5)) // UI items are seperate GameObjects. should I maybe use graphics instead?
    this.pauseUI.push(this.add.text(10, h / 2, 'Paused', { fontSize: '32px' }))
    this.pauseUI.push(this.add.text(10, h / 2 + 32, '', { fontSize: '16px' })) // for inventory items
    this.hidePauseUI()

    // Pause game
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      const scenePlugin = CurrentSceneManager.scene.scene
      if (!this.gamePaused) {
        // new Phaser.Events.EventEmitter()
        this.showPauseUI()
        scenePlugin.pause()
      } else {
        this.hidePauseUI()
        scenePlugin.resume()
      }
      this.gamePaused = !this.gamePaused
    })
  }

  private showPauseUI() {
    this.pauseUI[2].setText('Items: ' + JSON.stringify(this.cache.json.get('saveFile').inventory))
    this.pauseUI.forEach(g => g.setVisible(true))
  }

  private hidePauseUI() {
    this.pauseUI.forEach(g => g.setVisible(false))
  }
}