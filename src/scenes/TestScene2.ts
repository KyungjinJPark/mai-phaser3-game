// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { DialogueManager } from "../managers/DialogueManager"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
// systems
import { ObjectManager } from "../managers/ObjectManager"
// types
import { Direction } from "../types/Direction"
// objects
import { Interactable } from "../objects/abilities/Interactable"
import { Player } from '../objects/Player'
import { NPC } from "../objects/NPC"
import { Sign } from "../objects/Sign"
import { Partier } from "../objects/Partier"
import { Door } from "../objects/Door"
import { Party } from "../objects/Party"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene2'
}

export class TestScene2 extends Phaser.Scene {
  private inputManager: InputManager
  private objectManager: ObjectManager
  private party: Party
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
      layer.scale = Settings.zoom
    }

    // create party
    const player = new Player(3, 3, 'reaper')
    const partiers = [new Partier(3, 3, 'reaper'), new Partier(3, 3, 'reaper')]
    this.party = new Party(player, partiers)
    partiers[0].sprite.setDepth(24.9) // TODO: stopgap bc no depth sorting
    partiers[1].sprite.setDepth(24.8)

    this.inputManager.setParty(this.party)

    // create & set up camera
    const mapWidth = map.widthInPixels * Settings.zoom
    const mapHeight = map.heightInPixels * Settings.zoom
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.party.player.getSprite())
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    
    const interactables: Interactable[] = [
      new Door(18, 6, 'TestScene'),
    ]

    this.NPCs = [
      new NPC(7, 10, 'npc', [{type: 'dialogue', dialogue: '2 fast 2 quick'}], {loop: true, instructions: ['l','u','u','r','r','d','d','l']}),
    ]

    // init Grid logic
    this.objectManager = new ObjectManager(
      map,
      [].concat(interactables, this.NPCs),
      [].concat(this.party.player, this.party.partiers, this.NPCs)
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
    this.party.update(delta)
    this.NPCs.forEach((npc) => {
      npc.update(delta)
    })
  }
}