import { DialogueModalPlugin } from "../plugins/DialogueModal"

import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Player } from '../objects/Player'

// aliases
const Vector2 = Phaser.Math.Vector2
type Vector2 = Phaser.Math.Vector2

class GridPhysics { // custom physics engine
  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 350
  private directionVectors: { [key in Direction]: Vector2 } = {
    [Direction.NONE]: new Vector2(0, 0),
    [Direction.RIGHT]: new Vector2(1, 0),
    [Direction.UP]: new Vector2(0, -1),
    [Direction.LEFT]: new Vector2(-1, 0),
    [Direction.DOWN]: new Vector2(0, 1)
  }
  private tilePixelsMoved = 0
  private facingDirection: Direction = Direction.NONE

  constructor(private player: Player, private map: Phaser.Tilemaps.Tilemap,
    
    private da: DialogueManager // this probably shouldn't be here, but i need the temporary interaction to work
    
    ) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta)
    }
    this.movingIntent = Direction.NONE
  }

  movePlayer(direction: Direction) { // public by default
    this.movingIntent = direction
    if (this.isMoving()) {
      return
    } else if (this.isBlockedInDir(direction)) {
      this.player.stopAnimation(direction)
      this.facingDirection = direction
    } else {
      this.startMoving(direction)
      this.facingDirection = direction
    }
  }

  isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  startMoving(direction: Direction) {
    this.player.startAnimation(direction)
    this.movingDirection = direction
    this.updatePlayerTilePos()
  }

  stopMoving() {
    this.player.stopAnimation(this.movingDirection)
    this.movingDirection = Direction.NONE
  }

  updatePlayerPosition(delta: number) {
    const deltaInSec = delta / 1000
    const pixelsToMove = deltaInSec * this.movePixelsPerSecond

    if (!this.willCrossBorder(pixelsToMove)) {
      this.movePlayerSprite(pixelsToMove)
    } else if (this.shouldContinueMove()) { // has moving intention
      this.movePlayerSprite(pixelsToMove)
      this.updatePlayerTilePos()
    } else {
      this.movePlayerSprite(Settings.getTileSize() - this.tilePixelsMoved)
      this.stopMoving()
    }
  }

  private shouldContinueMove() {
    return (
      this.movingIntent === this.movingDirection &&
      !this.isBlockedInDir(this.movingDirection)
    )
  }

  private isBlockedInDir(dir: Direction): boolean {
    return this.hasCollisionTile(this.tilePosInDir(dir))
  }

  private tilePosInDir(dir: Direction): Vector2 {
    return this.player.getTilePosition().add(this.directionVectors[dir])
  }

  private hasCollisionTile(tilePos: Vector2): boolean {
    if (!this.mapHasTileAt(tilePos)) return true
    return this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return tile && tile.properties.collides
    })
  }

  mapHasTileAt(tilePos: Phaser.Math.Vector2) {
    return this.map.layers.some((layer) => {
      return this.map.hasTileAt(tilePos.x, tilePos.y, layer.name)
    })
  }

  updatePlayerTilePos() {
    this.player.setTilePosition(
      this.player.getTilePosition().add(this.directionVectors[this.movingDirection])
    )
  }

  private willCrossBorder(pixelsToMove: number): boolean {
    return this.tilePixelsMoved + pixelsToMove >= Settings.getTileSize()
  }

  private movePlayerSprite(pixelsToMove: number) {
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.player.getPosition().add(moveVect.scale(pixelsToMove))
    this.tilePixelsMoved += pixelsToMove
    this.tilePixelsMoved %= Settings.getTileSize()
    this.player.setPosition(newPos)
  }

  playerInteract() {
    if (this.isMoving()) {
      return
    } else {
      const interactable = this.getInteractableAt(this.tilePosInDir(this.facingDirection))
      if (interactable !== undefined) {
        interactable.interact()
      }
    }
  }


  // stopgap manual creation of interactables
  private interactables: { [key: string]: Interactable } = {
    '31,0': {
      interact: () => {
        this.da.showDialogue('boja sitkny')
      }
    },
    '5,1': {
      interact: () => {
        this.da.showDialogue('RIP our dog\nHEE HEE HOO HOO')
      }
    },
    '10,7': {
      interact: () => {
        this.da.showDialogue('our house')
      }
    },
    '18,21': {
      interact: () => {
        this.da.showDialogue('<-- somewhere\n--> somewhere else')
      }
    },
  }

  private getInteractableAt(tilePos: Vector2): Interactable {
    // console.log(`${tilePos.x},${tilePos.y}`)
    return this.interactables[`${tilePos.x},${tilePos.y}`]
  }
}

// TODO Make this a thing
type Interactable = any

class GridControls {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {
    this.create()
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.cursors.space.on('down', () => {
      this.gridPhysics.playerInteract()
    })
  }

  update() {
    // TODO: do most recent action when many keys are pressed
    if (this.cursors?.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT)
    } else if (this.cursors?.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT)
    } else if (this.cursors?.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP)
    } else if (this.cursors?.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN)
    }
  }
}

/**
 * TODO: The dialogue manager existing doesn't require a HUD Scene to have already been created.
 */
class DialogueManager {
  private dialoguePlugin: DialogueModalPlugin

  constructor(that) {
    // load the DialogueModalPlugin
    this.dialoguePlugin = that.plugins.get('DialogueModalPlugin') as any
  }

  showDialogue(message: string) {
    this.dialoguePlugin.createDialogueBox()
    this.dialoguePlugin.setText(message, true)
  }
}

const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'TestScene'
}

export class TestScene extends Phaser.Scene {
  private gridPhysics: GridPhysics
  private gridControls: GridControls
  private player: Player
  private dialogueManager: DialogueManager

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
    
    // init Grid logic
    this.dialogueManager = new DialogueManager(this)
    this.gridPhysics = new GridPhysics(this.player, map, this.dialogueManager)
    this.gridControls = new GridControls(this.input, this.gridPhysics)
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
    this.gridControls.update()
    this.gridPhysics.update(delta) // in ms // delta only matters for different framerates
  }
}