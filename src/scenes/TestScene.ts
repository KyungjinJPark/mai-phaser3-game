// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { DialogueManager } from "../managers/DialogueManager"
// engine
import { GridPhysics } from "../engine/GridPhysics"
// types
import { Direction } from "../types/Direction"
// objects
import { Player } from '../objects/Player'

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
  private inputManager: InputManager
  private dialogueManager: DialogueManager
  private gridPhysics: GridPhysics
  private player: Player

  constructor () {
    super(testSceneConfig)
  }

  public create () {
    // make map
    let map = this.make.tilemap({ key: 'green_map' })
    let tiles = map.addTilesetImage('green_tiles', 'green_tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(i, tiles)
      layer.setDepth(i*10)
      layer.scale = Settings.getZoom()
    }

    // init player
    const playerSprite = this.add.sprite(0, 0, 'reaper', 1)
    playerSprite.setDepth(25)
    playerSprite.scale = Settings.getZoom()
    const mapWidth = map.widthInPixels * Settings.getZoom()
    const mapHeight = map.heightInPixels * Settings.getZoom()
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(playerSprite)
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    this.player = new Player(playerSprite, new Phaser.Math.Vector2(3, 3))
    this.createPlayerAnim(Direction.RIGHT, 6, 8)
    this.createPlayerAnim(Direction.UP, 9, 11)
    this.createPlayerAnim(Direction.LEFT, 3, 5)
    this.createPlayerAnim(Direction.DOWN, 0, 2)
    
    // init Grid logic
    this.dialogueManager = new DialogueManager(this)
    this.gridPhysics = new GridPhysics(this.player, map, this.dialogueManager)
    this.inputManager = new InputManager(this.input, this.gridPhysics)
  }

  createPlayerAnim(name: Direction, startFrames: number, endFrame: number) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers('reaper', {
        start: startFrames,
        end: endFrame
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })
  }

  public update (_time: number, delta: number) {
    this.inputManager.update()
    this.gridPhysics.update(delta) // in ms // delta only matters for different framerates
  }
}