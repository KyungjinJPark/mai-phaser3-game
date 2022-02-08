import * as Phaser from 'phaser'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
}

export class GameScene extends Phaser.Scene {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }

  constructor () {
    super(sceneConfig)
  }

  public preload () {}

  public create () {
    this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any
    this.physics.add.existing(this.square)

    this.cursorKeys = this.input.keyboard.createCursorKeys()
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
  title: 'TS Game',
  type: Phaser.AUTO,
  
  scale: {
    width: window.innerWidth,
    height: window.innerHeight
  },

  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    },
  },

  scene: [GameScene],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)