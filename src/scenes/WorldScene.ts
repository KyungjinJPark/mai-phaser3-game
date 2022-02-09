const worldSceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'WorldScene'
}

export class WorldScene extends Phaser.Scene {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private moveDir: string = 'down'

  constructor () {
    super(worldSceneConfig)
  }

  public create () {
    this.cursorKeys = this.input.keyboard.createCursorKeys()

    let map = this.make.tilemap({ key: 'map' })
    let tiles = map.addTilesetImage('Roguelike', 'tiles')
    let ground = map.createLayer('Ground', tiles)
    let groundOver = map.createLayer('Ground_Over', tiles)
    let groundOverColl = map.createLayer('Ground_Over_Coll', tiles)
    let objects = map.createLayer('Objects', tiles)
    let objectsColl = map.createLayer('Objects_Coll', tiles)
    let houseMisc = map.createLayer('HouseMisc', tiles)
    let toppers = map.createLayer('Toppers', tiles)
    groundOverColl.setCollisionByExclusion([-1]) // -1 = all layers are collidable
    objectsColl.setCollisionByExclusion([-1])
    
    this.player = this.physics.add.sprite(200, 100, 'player', 0)

    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 3 ] }),
      frameRate: 0,
      repeat: -1
    })
    this.anims.create({ // use animation flipping
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 1 ] }),
      frameRate: 0,
      repeat: -1
    })
    this.anims.create({
      key: 'idle_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 2 ] }),
      frameRate: 0,
      repeat: -1
    })
    this.anims.create({
      key: 'idle_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 0 ] }),
      frameRate: 0,
      repeat: -1
    })
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
    this.physics.add.collider(this.player, groundOverColl)
    this.physics.add.collider(this.player, objectsColl)
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
      this.moveDir = 'left'
    } else if (this.cursorKeys.right.isDown) {
      this.player.anims.play('walk_right', true)
      this.moveDir = 'right'
    } else if (this.cursorKeys.up.isDown) {
      this.player.anims.play('walk_up', true)
      this.moveDir = 'up'
    } else if (this.cursorKeys.down.isDown) {
      this.player.anims.play('walk_down', true)
      this.moveDir = 'down'
    } else {
      if (this.moveDir === 'left') {
        this.player.anims.play('idle_left', true)
      } else if (this.moveDir === 'right') {
        this.player.anims.play('idle_right', true)
      } else if (this.moveDir === 'up') {
        this.player.anims.play('idle_up', true)
      } else if (this.moveDir === 'down') {
        this.player.anims.play('idle_down', true)
      }
    }
  }
}