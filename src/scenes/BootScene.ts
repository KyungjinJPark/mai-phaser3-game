import { DialogueManager } from "../managers/DialogueManager"

const bootSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'BootScene'
}

export class BootScene extends Phaser.Scene {
  constructor () {
    super(bootSceneConfig)
  }

  public preload () {
    this.load.image('green_tiles', 'assets/map/ss_green_tiles.png')
    this.load.tilemapTiledJSON('green_map_0', 'assets/map/tiled_test_0.json')
    this.load.tilemapTiledJSON('green_map_1', 'assets/map/tiled_test_1.json')
    this.load.spritesheet('reaper', 'assets/ss_reaper_blade.png', {
      frameWidth: 32,
      frameHeight: 36
    })
    // NPC
    this.load.spritesheet('npc', 'assets/ss_eight_people.png', {
      frameWidth: 26,
      frameHeight: 36
    })
  }

  public create () {
    // go straight to TestScene
    DialogueManager.getInstance().init(this)
    this.scene.start('TestScene')
  }
}