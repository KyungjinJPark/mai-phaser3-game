const testSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'TestScene'
}

enum Direction {
  NONE = 'none',
  RIGHT = 'right',
  UP = 'up',
  LEFT = 'left',
  DOWN = 'down'
}
// aliases
const Vector2 = Phaser.Math.Vector2
type Vector2 = Phaser.Math.Vector2

class GridPhysics { // custom physics engine
  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 100
  private directionVectors: { [key in Direction]: Vector2 } = {
    [Direction.NONE]: new Vector2(0, 0),
    [Direction.RIGHT]: new Vector2(1, 0),
    [Direction.UP]: new Vector2(0, -1),
    [Direction.LEFT]: new Vector2(-1, 0),
    [Direction.DOWN]: new Vector2(0, 1)
  }
  private tilePixelsMoved = 0

  constructor(private player: Player, private map: Phaser.Tilemaps.Tilemap) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta)
    }
    this.movingIntent = Direction.NONE
  }

  movePlayer(direction: Direction) { // public by default
    this.movingIntent = direction
    console.log('move pressing');
    console.log(this.isMoving());
    
    
    if (this.isMoving()) {
      return
    } else if (this.isBlockedInDir(direction)) {
      this.player.stopAnimation(direction)
    } else {
      this.startMoving(direction)
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
      this.movePlayerSprite(TestScene.TILE_SIZE - this.tilePixelsMoved)
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
    return this.tilePixelsMoved + pixelsToMove >= TestScene.TILE_SIZE
  }

  private movePlayerSprite(pixelsToMove: number) {
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.player.getPosition().add(moveVect.scale(pixelsToMove))
    this.tilePixelsMoved += pixelsToMove
    this.tilePixelsMoved %= TestScene.TILE_SIZE
    this.player.setPosition(newPos)
  }
}

class GridControls {
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {}

  update() {
    const cursors = this.input.keyboard.createCursorKeys()
    if (cursors.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT)
    } else if (cursors.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP)
    } else if (cursors.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT)
    } else if (cursors.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN)
    }
  }
}

class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2,
  ) {
    const offsetX = TestScene.TILE_SIZE / 2
    const offsetY = TestScene.TILE_SIZE // what are these for?

    this.sprite.setOrigin(0.5, 1)
    this.sprite.setPosition(
      tilePos.x * TestScene.TILE_SIZE + offsetX,
      tilePos.y * TestScene.TILE_SIZE + offsetY
    )
  }

  getPosition() {
    return this.sprite.getBottomCenter()
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setPosition(pos: Phaser.Math.Vector2) {
    this.sprite.setPosition(pos.x, pos.y)
  }

  setTilePosition(pos: Phaser.Math.Vector2) {
    this.tilePos = pos.clone()
    
  }

  startAnimation(direction: Direction) {
    this.sprite.anims.play(direction)
  }

  stopAnimation(direction: Direction) {
    const animForDir = this.sprite.anims.animationManager.get(direction)
    const idleFrame = animForDir.frames[1].frame.name
    this.sprite.anims.stop()
    this.sprite.setFrame(idleFrame)
  }
}

export class TestScene extends Phaser.Scene {
  public static readonly TILE_SIZE = 16

  private gridPhysics: GridPhysics
  private gridControls: GridControls
  private player: Player

  constructor () {
    super(testSceneConfig)
  }

  public create () {
    // make map
    let map = this.make.tilemap({ key: 'green_map' })
    let tiles = map.addTilesetImage('green_tiles', 'green_tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(i, tiles)
      layer.setDepth(i)
      // layer.scale = 3 // this seems like a good idea
    } // when do I enable collisions?

    // init player
    const playerSprite = this.add.sprite(0, 0, 'reaper', 1)
    playerSprite.setDepth(3)
    // playerSprite.scale = 3 // this too
    const mapWidth = map.widthInPixels
    const mapHeight = map.heightInPixels
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(playerSprite)
    // this.cameras.main.roundPixels = true // even w/o this, the tile doesnt bleed
    this.player = new Player(playerSprite, new Phaser.Math.Vector2(3, 3))
    this.createPlayerAnim(Direction.RIGHT, 6, 8)
    this.createPlayerAnim(Direction.UP, 9, 11)
    this.createPlayerAnim(Direction.LEFT, 3, 5)
    this.createPlayerAnim(Direction.DOWN, 0, 2)
    
    // init Grid logic
    this.gridPhysics = new GridPhysics(this.player, map)
    this.gridControls = new GridControls(this.input, this.gridPhysics)

    // // add a sign
    // let sign = this.add.rectangle(200, 200, 16, 16)
    // this.physics.add.existing(sign, true)
    // sign.setData('interact_able', true) // this might be a redundant. could just check if `interact_action` is `undefined`
    // sign.setData('interact_action', () => {
    //   console.log('interacted with sign')
    // })
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