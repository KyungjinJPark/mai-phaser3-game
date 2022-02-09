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
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

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
    doorsWindowsEtc.setCollisionByExclusion([-1])
    roofObjs.setCollisionByExclusion([-1])
    
    this.player = this.physics.add.sprite(200, 100, 'player', 0)

    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 7, 3, 11, 3 ] }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({ // use animation flipping
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 5, 1, 9, 1 ] }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 6, 2, 10, 2 ] }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 4, 0, 8, 0 ] }),
      frameRate: 10,
      repeat: -1
    })

    const mapWidth = map.widthInPixels
    const mapHeight = map.heightInPixels
    this.physics.world.bounds.width = mapWidth
    this.physics.world.bounds.height = mapHeight
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, objects)
    this.physics.add.collider(this.player, doorsWindowsEtc)
    this.physics.add.collider(this.player, roofObjs)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.roundPixels = true // even w/o this, the tile doesnt bleed
  }

  public update () {
    if (this.cursorKeys.up.isDown) {
      this.player.body.setVelocityY(-80)
    } else if (this.cursorKeys.down.isDown) {
      this.player.body.setVelocityY(80)
    } else {
      this.player.body.setVelocityY(0)
    }

    if (this.cursorKeys.right.isDown) {
      this.player.body.setVelocityX(80)
    } else if (this.cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-80)
    } else {
      this.player.body.setVelocityX(0)
    }

    if (this.cursorKeys.left.isDown) {
      this.player.anims.play('walk_left', true)
    } else if (this.cursorKeys.right.isDown) {
      this.player.anims.play('walk_right', true)
    } else if (this.cursorKeys.up.isDown) {
      this.player.anims.play('walk_up', true)
    } else if (this.cursorKeys.down.isDown) {
      this.player.anims.play('walk_down', true)
    } else {
      this.player.anims.stop()
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