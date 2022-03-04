import { GridPhysics } from "../engine/GridPhysics"
import { Direction } from "../types/Direction"

export class InputManager {
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
    // TOmaybeDO: do most recent action when many keys are pressed
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