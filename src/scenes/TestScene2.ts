// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { DialogueManager } from "../managers/DialogueManager"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
// systems
import { GridPhysics } from "../systems/GridPhysics"
// types
import { Direction } from "../types/Direction"
// objects
import { Interactable } from "../objects/abilities/Interactable"
import { Player } from '../objects/Player'
import { NPC } from "../objects/NPC"
import { Sign } from "../objects/Sign"
import { Partier } from "../objects/Partier"
import { Door } from "../objects/Door"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene2'
}

export class TestScene2 extends Phaser.Scene {
  private inputManager: InputManager
  private gridPhysics: GridPhysics
  private player: Player
  private partiers: Partier[]
  private NPCs: NPC[]
  
  constructor () {
    super(testSceneConfig)
  }

  public create () {
    // Initialize managers
    CurrentSceneManager.getInstance().setCurrentScene(this)
    DialogueManager.getInstance().init(this)
    this.inputManager = new InputManager(this.input)

    // make map
    let map = this.make.tilemap({ key: 'green_map_1' })
    let tiles = map.addTilesetImage('green_tiles', 'green_tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(i, tiles)
      layer.setDepth(i*10)
      layer.scale = Settings.getZoom()
    }


    // create partier
    this.partiers = [new Partier(3, 3, 'reaper'), new Partier(3, 3, 'reaper')]
    this.partiers[0].sprite.setDepth(24.9)
    this.partiers[1].sprite.setDepth(24.8)
    this.inputManager.setPartier(this.partiers[0], 0)
    this.inputManager.setPartier(this.partiers[1], 1)

    // create player
    this.player = new Player(3, 3, 'reaper')
    this.createAnim('reaper', Direction.RIGHT, 6, 8)
    this.createAnim('reaper', Direction.UP, 9, 11)
    this.createAnim('reaper', Direction.LEFT, 3, 5)
    this.createAnim('reaper', Direction.DOWN, 0, 2)
    this.inputManager.setPlayer(this.player)

    // create & set up camera
    const mapWidth = map.widthInPixels * Settings.getZoom()
    const mapHeight = map.heightInPixels * Settings.getZoom()
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player.getSprite())
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    
    const interactables: Interactable[] = [
      new Door(18, 6, 'TestScene'),
    ]

    this.NPCs = [
      new NPC(7, 10, 'npc', [{type: 'dialogue', dialogue: '2 fast 2 quick'}], ['l','u','u','r','r','d','d','l']),
    ]
    // TOmaybeDO: make NPC animations in class. something to think about: recreating NPCs w same animations
    this.createAnim('npc', Direction.RIGHT, 54 + 24, 56 + 24)
    this.createAnim('npc', Direction.UP, 54 + 36, 56 + 36)
    this.createAnim('npc', Direction.LEFT, 54 + 12, 56 + 12)
    this.createAnim('npc', Direction.DOWN, 54 + 0, 56 + 0)

    // init Grid logic
    this.gridPhysics = new GridPhysics(
      map,
      [].concat(interactables, this.NPCs),
      [].concat(this.player, this.partiers, this.NPCs)
    )
  }

  createAnim(spriteKey: string, direction: Direction, startFrames: number, endFrame: number) {
    this.anims.create({
      key: `${spriteKey}_${direction}`,
      frames: this.anims.generateFrameNumbers(spriteKey, {
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
    this.player.update(delta)
    this.partiers.forEach((partier) => {
      partier.update(delta)
    })
    this.NPCs.forEach((npc) => {
      npc.update(delta)
    })
  }
}