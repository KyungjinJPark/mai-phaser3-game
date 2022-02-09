import * as Phaser from 'phaser'

const bootSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  // active: false,
  // visible: false, // idk what are these for
  key: 'BootScene'
}

export class BootScene extends Phaser.Scene {
  constructor () {
    super(bootSceneConfig)
  }

  public preload () {
    this.load.image('tiles', 'assets/map/ss_tiles.png')
    this.load.tilemapTiledJSON('map', 'assets/map/map_test.json')
    this.load.spritesheet('player', 'assets/ss_player.png', { frameWidth: 16, frameHeight: 16 });
  }

  public create () {
    // go straight into WorldScene
    this.scene.start('WorldScene');
  }
}


const worldSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'WorldScene'
}

export class WorldScene extends Phaser.Scene {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }

  constructor () {
    super(worldSceneConfig)
  }

  public create () {
    this.cursorKeys = this.input.keyboard.createCursorKeys()
    let map = this.make.tilemap({ key: 'map' })
    let tiles = map.addTilesetImage('Roguelike', 'tiles')
    let ground = map.createLayer('Ground/terrain', tiles)
    let paths = map.createLayer('Ground overlay', tiles)
    let objects = map.createLayer('Objects', tiles)
    let doorsWindowsEtc = map.createLayer('Doors\/windows\/roof', tiles)
    let roofObjs = map.createLayer('Roof object', tiles)
    objects.setCollisionByExclusion([-1]) // -1 = all layers are collidable
    doorsWindowsEtc.setCollisionByExclusion([-1]) // -1 = all layers are collidable
    roofObjs.setCollisionByExclusion([-1]) // -1 = all layers are collidable
    // ground.resizeWorld()
  
    this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any
    this.physics.add.existing(this.square)
  }

  public update () {
    if (this.cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500)
    } else if (this.cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500)
    } else {
      this.square.body.setVelocityY(0)
    }

    if (this.cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500)
    } else if (this.cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500)
    } else {
      this.square.body.setVelocityX(0)
    }
  }
}


const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'TS Game',

  scale: {
    width: 320,
    height: 240,
  },
  zoom: 2, // enlarges the game scale
  pixelArt: true,

  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    },
  },

  scene: [BootScene, WorldScene],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)