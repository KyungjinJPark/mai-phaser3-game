// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { ObjectManager } from "../managers/ObjectManager"
// types
import { Direction } from "../types/Direction"
// abilities
import { Interactable } from "../objects/abilities/Interactable"
// objects
import { Player } from '../objects/Player'
import { NPC } from "../objects/NPC"
import { Partier } from "../objects/Partier"
import { Party } from "../objects/Party"
import { SimpleInteractable } from "../objects/SimpleInteractable"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene2'
}

export class TestScene2 extends Phaser.Scene {
  public inputManager: InputManager
  private objectManager: ObjectManager
  private party: Party
  private NPCs: NPC[]
  
  constructor () {
    super(testSceneConfig)
  }

  public create () {
    // Initialize managers
    CurrentSceneManager.getInstance().setCurrentScene(this)
    this.inputManager = new InputManager(this.input)
    this.objectManager = new ObjectManager()

    // make map
    let map = this.make.tilemap({ key: 'green_map_1' })
    let tiles = map.addTilesetImage('green_tiles', 'green_tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(i, tiles)
      layer.setDepth(i*10)
      layer.scale = Settings.zoom
    }
    this.objectManager.setMap(map)

    // create party
    const player = new Player(this, this.objectManager, 3, 3, 'reaper')
    const partiers = [new Partier(this, this.objectManager, 3, 3, 'reaper'), new Partier(this, this.objectManager, 3, 3, 'reaper')]
    this.party = new Party(player, partiers)
    partiers[0].gameObject.setDepth(24.9) // TODO: stopgap bc no depth sorting
    partiers[1].gameObject.setDepth(24.8)

    this.inputManager.setParty(this.party)

    // create & set up camera
    const mapWidth = map.widthInPixels * Settings.zoom
    const mapHeight = map.heightInPixels * Settings.zoom
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.party.player.sprite)
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    
    const interactables: Interactable[] = [
      new SimpleInteractable(this, this.objectManager, 9, 7, '', [{type: 'transition', transition: 'TestScene2'}]),
    ]

    this.NPCs = [
      // new NPC(this, this.objectManager, 7, 10, 'npc', [{type: 'dialogue', dialogue: '2 fast 2 quick'}], {loop: true, instructions: ['l','u','u','r','r','d','d','l']}),
    ]
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
  }}