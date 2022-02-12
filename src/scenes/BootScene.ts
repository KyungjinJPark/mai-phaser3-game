const bootSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'BootScene'
}

export class BootScene extends Phaser.Scene {
  constructor () {
    super(bootSceneConfig)
  }

  public preload () {
    this.load.image('green_tiles', 'assets/map/ss_green_tiles.png')
    this.load.tilemapTiledJSON('green_map', 'assets/map/tiled_test.json')
    this.load.spritesheet('reaper', 'assets/ss_reaper_blade.png', {
      frameWidth: 32,
      frameHeight: 36
    })
  }

  public create () {
    // go straight to TestScene
    this.scene.launch('HUDScene')
    this.scene.start('TestScene')
  }
}