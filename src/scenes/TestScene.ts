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
import { Party } from "../objects/Party"
import { Player } from '../objects/Player'
import { Partier } from "../objects/Partier"
import { NPC } from "../objects/NPC"
import { Sign } from "../objects/Sign"
import { Door } from "../objects/Door"
import { Photo } from "../objects/Photo"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
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
    this.inputManager = new InputManager(this.input)

    // make map
    let map = this.make.tilemap({ key: 'green_map_0' })
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

    // ====================== ANIMATIONS ======================
    // TODO: when is the best time to make these animations
    // create player animations
    this.createAnim('reaper', Direction.RIGHT, 6, 8)
    this.createAnim('reaper', Direction.UP, 9, 11)
    this.createAnim('reaper', Direction.LEFT, 3, 5)
    this.createAnim('reaper', Direction.DOWN, 0, 2)
    
    this.anims.create({
      key: `npc_spin`,
      frames: this.anims.generateFrameNumbers('npc', {
        frames: [55, 54, 54, 54, 56, 54+24, 56+36, 54+12, 56, 56, 55]
      }),
      frameRate: 10,
    })
    
    // TOmaybeDO: make NPC animations in class. something to think about: recreating NPCs w same animations
    this.createAnim('npc', Direction.RIGHT, 54 + 24, 56 + 24)
    this.createAnim('npc', Direction.UP, 54 + 36, 56 + 36)
    this.createAnim('npc', Direction.LEFT, 54 + 12, 56 + 12)
    this.createAnim('npc', Direction.DOWN, 54 + 0, 56 + 0)
    // ========================================================


    // create & set up camera
    const mapWidth = map.widthInPixels * Settings.zoom
    const mapHeight = map.heightInPixels * Settings.zoom
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.party.player.sprite) // TODO: won't need this
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
    
    const interactables: Interactable[] = [
      new Sign(31, 0, 'boja sitkny'),
      new Sign(5, 1, 'RIP our dog\nHEE HEE HOO HOO'),
      new Door(9, 7, 'TestScene2'),
      new Sign(10, 7, 'our house'),
    ]

    const sf = this.cache.json.get('saveFile')
    if (sf.TestScene_hasPhoto) {
      interactables.push(new Photo(3, 1))
    }

    this.NPCs = [
      new NPC(5, 4, 'npc', [
        {type: 'dialogue', dialogue: '2 fast 2 quick'},
        {type: 'animation', animation: 'npc_spin'},
        {type: 'move', move: {loop: false, instructions: ['l','u','r','d']}},
      ], {loop: true, instructions: ['l','u','u','r','r','d','d','l']}),
      new NPC(1, 5, 'npc', [
        {type: 'dialogue', dialogue: 'Why am I alive'},
        {type: 'animation', animation: 'npc_spin'},
        {type: 'function', function: () => {console.log('function0')}},
        {type: 'function', function: () => {setTimeout(() => {console.log('function1')}, 1000)}},
        
        {type: 'animation', animation: 'npc_spin'},
        {type: 'function', function: () => {console.log('function0')}},
        {type: 'animation', animation: 'npc_spin'},
        
        {type: 'function', function: () => {
          const sf = this.cache.json.get('saveFile')
          sf.inventory.push('sword')
          this.cache.json.add('saveFile', sf)
        }},
        {type: 'move', move: {loop: false, instructions: ['l','u','r','d']}},
        // {type: 'transition', transition: 'TestScene2'},
      ]),
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