// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { ObjectManager } from "../managers/ObjectManager"
// types
import { Direction } from "../types/Direction"
// objects
import { Party } from "../objects/Party"
import { Player } from '../objects/Player'
import { Partier } from "../objects/Partier"
import { NPC } from "../objects/NPC"
import { SimpleInteractable } from "../objects/SimpleInteractable"
import { BaseObject } from "../objects/BaseObject"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
  public inputManager: InputManager // TODO: public for now, but should be private
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
    let map = this.make.tilemap({ key: 'green_map_0' })
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
    this.cameras.main.startFollow(this.party.player.gameObject) // TODO: won't need this
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes

    const interactables: SimpleInteractable[] = [
      new SimpleInteractable(this, this.objectManager, 31, 0, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['boja sitkny']}}]),
      new SimpleInteractable(this, this.objectManager, 5, 1, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['RIP our dog\nHEE HEE HOO HOO']}}]),
      new SimpleInteractable(this, this.objectManager, 9, 7, '', [{type: 'transition', transition: 'TestScene2'}]),
      new SimpleInteractable(this, this.objectManager, 10, 7, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['our house']}}]),
    ]

    const sf = this.cache.json.get('saveFile')
    if (sf.TestScene_hasPhoto) {
      interactables.push(new SimpleInteractable(this, this.objectManager, 3, 1, 'photo', [
        {type: 'function', function: function() { //TODO: I THINK making this a NON-arrow function makes `this` refer to the caller?
          // change save file json
          const currScene = CurrentSceneManager.getInstance().getCurrentScene()
          const sf = currScene.cache.json.get('saveFile')
          sf.TestScene_hasPhoto = false
          sf.inventory.push('photo')
          currScene.cache.json.add('saveFile', sf)
          // destroy self
          const dis = this as BaseObject
          dis.destroy()
        }},
      ]))
    }

    this.NPCs = [
      new NPC(this, this.objectManager, 5, 4, 'npc', [
        {type: 'dialogue', dialogue: { type: 'text', text: ['2 fast 2 quick']}},
        {type: 'animation', animation: 'npc_spin'}, // TODO: 🐞
        {type: 'move', move: {loop: false, instructions: ['l','u','r','d']}}, // TODO: 🐞
      ], {loop: true, instructions: ['l','u','u','r','r','d','d','l']}),
      new NPC(this, this.objectManager, 1, 5, 'npc', [
        {type: 'dialogue', dialogue: { type: 'text', text: ['Why am I alive']}},
        {type: 'animation', animation: 'npc_spin'},
        {type: 'function', function: () => {
          const sf = this.cache.json.get('saveFile')
          sf.inventory.push('sword')
          this.cache.json.add('saveFile', sf)
        }},
        {type: 'dialogue', dialogue: { type: 'text', text: ['I just gave you a sword']}},
        {type: 'move', move: {loop: false, instructions: ['l','u','r','d']}},
        {type: 'function', function: () => {
          this.party.tryMove(Direction.UP)
        }},
        {type: 'function', function: () => {
          this.NPCs[2].sprite.play('npc_spin')
        }},
      ]),
      new NPC(this, this.objectManager, 12, 8, 'npc', [
        {type: 'dialogue', dialogue: { type: 'text', text: ['This is a test', 'for multiple slides', 'of dialogue']}},
        {type: 'dialogue', dialogue: { type: 'text', text: ['Do you think', 'that this dialogue', 'feature is working?']}},
        {type: 'dialogue', dialogue: { type: 'choice', choice: ['yes', 'no', '*pig noises*'], var: 'sel_0'}},
        {type: 'dialogue', condition: { var: 'sel_0', value: 0 }, dialogue: { type: 'text', text: ['Great!']}},
      ]),
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
  }
}