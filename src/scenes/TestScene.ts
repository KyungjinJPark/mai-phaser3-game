// managers
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
// types
import { Direction } from "../types/Direction"
// scenes
import { BaseGameScene } from "./BaseGameScene"
// objects
import { BaseObject } from "../objects/BaseObject"
import { Player } from '../objects/Player'
import { Partier } from "../objects/Partier"
import { NPC } from "../objects/NPC"
import { SimpleInteractable } from "../objects/SimpleInteractable"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends BaseGameScene {
  public constructor() {
    super(testSceneConfig)
  }

  protected childCreate() {
    // set up map
    this.setUpMap('green_map_0', 'green_tiles')

    // set up party
    const player = new Player(this, this.objectManager, 3, 3, 'reaper')
    const partiers = [new Partier(this, this.objectManager, 3, 3, 'reaper'), new Partier(this, this.objectManager, 3, 3, 'reaper')]
    this.setUpParty(player, partiers)

    // set up camera
    this.setUpCamera()

    // ====================== ANIMATIONS ======================
    // TODO: when is the best time to make these animations
    const createAnim = (spriteKey: string, direction: Direction, startFrames: number, endFrame: number) => {
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

    // create player animations
    createAnim('reaper', Direction.RIGHT, 6, 8)
    createAnim('reaper', Direction.UP, 9, 11)
    createAnim('reaper', Direction.LEFT, 3, 5)
    createAnim('reaper', Direction.DOWN, 0, 2)
    
    this.anims.create({
      key: `npc_spin`,
      frames: this.anims.generateFrameNumbers('npc', {
        frames: [55, 54, 54, 54, 56, 54+24, 56+36, 54+12, 56, 56, 55]
      }),
      frameRate: 10,
    })
    
    // TOmaybeDO: make NPC animations in class. something to think about: recreating NPCs w same animations
    createAnim('npc', Direction.RIGHT, 54 + 24, 56 + 24)
    createAnim('npc', Direction.UP, 54 + 36, 56 + 36)
    createAnim('npc', Direction.LEFT, 54 + 12, 56 + 12)
    createAnim('npc', Direction.DOWN, 54 + 0, 56 + 0)
    // ========================================================

    this.objects.push(
      new SimpleInteractable(this, this.objectManager, 31, 0, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['boja sitkny']}}]),
      new SimpleInteractable(this, this.objectManager, 5, 1, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['RIP our dog\nHEE HEE HOO HOO']}}]),
      new SimpleInteractable(this, this.objectManager, 9, 7, '', [{type: 'transition', transition: 'TestScene2'}]),
      new SimpleInteractable(this, this.objectManager, 10, 7, '', [{type: 'dialogue', dialogue: {type: 'text', text: ['our house']}}]),
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
          this.objects[6].sprite.play('npc_spin')
        }},
      ]),
      new NPC(this, this.objectManager, 12, 8, 'npc', [
        {type: 'dialogue', dialogue: { type: 'text', text: ['This is a test', 'for multiple slides', 'of dialogue']}},
        {type: 'dialogue', dialogue: { type: 'text', text: ['Do you think', 'that this dialogue', 'feature is working?']}},
        {type: 'dialogue', dialogue: { type: 'choice', choice: ['yes', 'no', '*pig noises*'], var: 'sel_0'}},
        {type: 'dialogue', condition: { var: 'sel_0', value: 0 }, dialogue: { type: 'text', text: ['Great!']}},
      ]),
    )

    // save-file conditional items
    const sf = this.cache.json.get('saveFile')
    if (sf.TestScene_hasPhoto) {
      this.objects.push(new SimpleInteractable(this, this.objectManager, 3, 1, 'photo', [
        {type: 'function', function: function() { //TODO: I THINK making this a NON-arrow function makes `this` refer to the caller?
          // change save file json
          const currScene = CurrentSceneManager.scene 
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
  }

  protected childUpdate(delta: number) {}
}