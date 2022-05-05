import { BaseGameScene } from "./BaseGameScene"
import { SimpleInteractable } from "../objects/SimpleInteractable"
import { Player } from '../objects/Player'
import { Partier } from "../objects/Partier"

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene2'
}

export class TestScene2 extends BaseGameScene {
  public constructor () {
    super(testSceneConfig)
  }

  protected childCreate() {
    this.setUpMap('green_map_1', 'green_tiles')
    const player = new Player(this, this.objectManager, 3, 3, 'reaper')
    const partiers = [new Partier(this, this.objectManager, 3, 3, 'reaper'), new Partier(this, this.objectManager, 3, 3, 'reaper')]
    this.setUpParty(player, partiers)
    this.setUpCamera()
    
    this.objects.push(
      new SimpleInteractable(this, this.objectManager, 9, 7, '', [{type: 'transition', transition: 'TestScene2'}]),
    )
  }

  protected childUpdate(delta: number) {}
}