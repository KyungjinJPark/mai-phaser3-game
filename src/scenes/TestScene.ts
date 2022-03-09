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
import { Interactable } from "../objects/Interactable"
import { Player } from '../objects/Player'
import { NPC } from "../objects/NPC"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
  private inputManager: InputManager
  private dialogueManager: DialogueManager
  private gridPhysics: GridPhysics
  private player: Player

  // stopgap manual creation of interactables & NPCs
  private interactables_MANUAL: { [key: string]: Interactable } = {
    '31,0': {
      interact: () => {
        this.dialogueManager.showDialogue('boja sitkny')
      }
    },
    '5,1': {
      interact: () => {
        this.dialogueManager.showDialogue('RIP our dog\nHEE HEE HOO HOO')
      }
    },
    '10,7': {
      interact: () => {
        this.dialogueManager.showDialogue('our house')
      }
    },
    '18,21': {
      interact: () => {
        this.dialogueManager.showDialogue('<-- somewhere\n--> somewhere else')
      }
    },
  }
  private NPCs_MANUAL: [string, number, number, NPC][] = [
    ['npc', 5, 4, null],
    ['npc', 1, 5, null],
  ]

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
    
    // make NPC
    this.NPCs_MANUAL.forEach(([key, x, y], i) => {
      const NPCSprite = this.add.sprite(0, 0, key)
      NPCSprite.setDepth(25)
      NPCSprite.scale = Settings.getZoom()
      const theNPC = new NPC(NPCSprite, new Phaser.Math.Vector2(x, y))
      this.NPCs_MANUAL[i][3] = theNPC 
    })

    // init Grid logic
    this.dialogueManager = new DialogueManager(this)
    this.gridPhysics = new GridPhysics(this.player, map)
    this.gridPhysics.registerInteractables(this.interactables_MANUAL)
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
    this.NPCs_MANUAL.forEach(([, , , npc]) => {
      npc.update(delta)
    })
  }
}