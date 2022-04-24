import { DialogueManager } from "../managers/DialogueManager"

const bootSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'BootScene'
}

export class BootScene extends Phaser.Scene {
  public constructor() {
    super(bootSceneConfig)
  }

  public preload() {
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

    this.load.image('photo', 'assets/photo.png')

    // Save file
    const saveJSONString = localStorage.getItem('saveFile')
    if (saveJSONString) {
      const saveFile = JSON.parse(saveJSONString)
      this.load.json('saveFile', saveFile)
    } else {
      this.load.json('saveFile', 'assets/saveFile.json')
    }
  }

  public create() {
    const dialoguePlugin = this.plugins.get('DialogueModalPlugin') // load the DialogueModalPlugin
    DialogueManager.getInstance().assignPlugin(dialoguePlugin)
    this.scene.launch('HUDScene')
    this.scene.start('TestScene') // go straight to TestScene
  }
}