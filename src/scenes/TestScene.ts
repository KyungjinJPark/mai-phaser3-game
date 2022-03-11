// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { DialogueManager } from "../managers/DialogueManager"
// systems
import { GridPhysics } from "../systems/GridPhysics"
// types
import { Direction } from "../types/Direction"
// objects
import { Interactable } from "../objects/abilities/Interactable"
import { Player } from '../objects/Player'
import { NPC } from "../objects/NPC"
import { Sign } from "../objects/Sign"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
  private inputManager: InputManager
  private dialogueManager: DialogueManager
  private gridPhysics: GridPhysics
  private player: Player
  private NPCs: NPC[]

  constructor () {
    super(testSceneConfig)
  }

  public create () {
    // Initialize managers
    new CurrentSceneManager(this) // not used here, but used by children
    this.inputManager = new InputManager(this.input)
    this.dialogueManager = new DialogueManager(this)

    // make map
    let map = this.make.tilemap({ key: 'green_map' })
    let tiles = map.addTilesetImage('green_tiles', 'green_tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(i, tiles)
      layer.setDepth(i*10)
      layer.scale = Settings.getZoom()
    }

    // init player // TODO: maybe shouldn't be here
    const playerSprite = this.add.sprite(0, 0, 'reaper', 1)
    playerSprite.setDepth(25)
    playerSprite.scale = Settings.getZoom()
    const mapWidth = map.widthInPixels * Settings.getZoom()
    const mapHeight = map.heightInPixels * Settings.getZoom()
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(playerSprite)
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    this.player = new Player(3, 3, playerSprite)
    this.createPlayerAnim(Direction.RIGHT, 6, 8)
    this.createPlayerAnim(Direction.UP, 9, 11)
    this.createPlayerAnim(Direction.LEFT, 3, 5)
    this.createPlayerAnim(Direction.DOWN, 0, 2)
    this.inputManager.registerPlayer(this.player)
    
    const interactables: Interactable[] = [
      new Sign(31, 0, 'boja sitkny'),
      new Sign(5, 1, 'RIP our dog\nHEE HEE HOO HOO'),
      new Sign(10, 7, 'our house'),
      new Sign(18, 21, '<-- somewhere\n--> somewhere else'),
    ]

    this.NPCs = [
      new NPC(5, 4, 'npc'),
      new NPC(1, 5, 'npc')
    ]
    // TODO: maybe make NPC animations in class... something to think about: recreating NPCs w same animations
    this.anims.create({
      key: `npc_${Direction.RIGHT}`,
      frames: this.anims.generateFrameNumbers('npc', {
        start: 54 + 24,
        end: 56 + 24,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })
    this.anims.create({
      key: `npc_${Direction.UP}`,
      frames: this.anims.generateFrameNumbers('npc', {
        start: 54 + 36,
        end: 56 + 36,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })
    this.anims.create({
      key: `npc_${Direction.LEFT}`,
      frames: this.anims.generateFrameNumbers('npc', {
        start: 54 + 12,
        end: 56 + 12,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })
    this.anims.create({
      key: `npc_${Direction.DOWN}`,
      frames: this.anims.generateFrameNumbers('npc', {
        start: 54 + 0,
        end: 56 + 0,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })

    // init Grid logic
    const allInteractables = interactables.concat(this.NPCs)
    this.gridPhysics = new GridPhysics(
      map,
      allInteractables, // TODO: this seems wierd to have to do
      [this.player, this.NPCs[0]]
    )
    // this.gridPhysics.registerMovables([this.player, this.NPCs_MANUAL[0][3]])
    // this.gridPhysics.registerInteractables(this.interactables_MANUAL)
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
    this.NPCs.forEach((npc) => {
      npc.update(delta)
    })
  }
}