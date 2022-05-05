// global
import { Settings } from "../settings/Settings"
// managers
import { InputManager } from "../managers/InputManager"
import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { ObjectManager } from "../managers/ObjectManager"
// objects
import { BaseObject } from "../objects/BaseObject"
import { Party } from "../objects/Party"
import { Player } from '../objects/Player'
import { Partier } from "../objects/Partier"

export abstract class BaseGameScene extends Phaser.Scene {
  public inputManager: InputManager // TODO: public for now, but should be private
  protected map: Phaser.Tilemaps.Tilemap
  protected objectManager: ObjectManager
  protected party: Party
  protected objects: BaseObject[]
  
  public constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config)
  }

  public create() {
    // Initialize managers
    CurrentSceneManager.getInstance().setCurrentScene(this) // `this` refers to the child. Not sure if this is just for abstract classes or all parent classes.
    this.inputManager = new InputManager(this.input)
    this.objectManager = new ObjectManager()
    this.objects = []

    this.childCreate()
  }
  protected abstract childCreate()

  public update(_: number, delta: number) {
    this.inputManager.update()
    this.party.update(delta)
    this.objects.forEach((obj) => {
      obj.update(delta)
    })
    this.childUpdate(delta)
  }
  protected abstract childUpdate(delta: number)

  protected setUpMap(mapKey: string, tileKey: string) {
    // make map
    this.map = this.make.tilemap({ key: mapKey})
    let tiles = this.map.addTilesetImage(tileKey, tileKey) // tileset_according_to_map_file, phaser_key
    for (let i = 0; i < this.map.layers.length; i++) {
      const layer = this.map.createLayer(i, tiles)
      layer.setDepth(i*10)
      layer.scale = Settings.zoom
    }
    this.objectManager.setMap(this.map)
  }

  protected setUpParty(player: Player, partiers: Partier[]) {
    this.party = new Party(player, partiers)
    this.inputManager.setParty(this.party)
  }

  protected setUpCamera() {
    const mapWidth = this.map.widthInPixels * Settings.zoom
    const mapHeight = this.map.heightInPixels * Settings.zoom
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.party.player.gameObject)
    this.cameras.main.roundPixels = true // it do bleed.. only sometimes
  }
}