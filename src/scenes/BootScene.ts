const bootSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  // active: false,
  // visible: false, // idk what are these for
  key: 'BootScene'
}

export class BootScene extends Phaser.Scene {
  constructor () {
    super(bootSceneConfig)
  }

  public preload () {
    this.load.image('tiles', 'assets/map/ss_tiles.png')
    this.load.tilemapTiledJSON('map', 'assets/map/map_test.json')
    this.load.spritesheet('player', 'assets/ss_player.png', { frameWidth: 16, frameHeight: 16 });
  }

  public create () {
    // go straight into WorldScene
    this.scene.start('WorldScene');
  }
}