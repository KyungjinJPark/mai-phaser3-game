const hudSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'HUDScene',
}

export class HUDScene extends Phaser.Scene {
  constructor () {
    super(hudSceneConfig)
  }

  create () {
    this.scene.bringToTop()
  }
}