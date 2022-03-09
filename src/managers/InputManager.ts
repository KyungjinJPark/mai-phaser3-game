import { GridPhysics } from "../systems/GridPhysics"
import { Direction } from "../types/Direction"
import { Player } from "../objects/Player"

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor(
    private input: Phaser.Input.InputPlugin,
    private player: Player
  ) {
    this.create()
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.cursors.space.on('down', () => {
      this.player.tryInteract()
    })
  }

  update() {
    // TOmaybeDO: do most recent action when many keys are pressed
    if (this.cursors?.right.isDown) {
      this.player.mover.tryMove(Direction.RIGHT) // TODO: maybe should be a method on player
    } else if (this.cursors?.left.isDown) {
      this.player.mover.tryMove(Direction.LEFT)
    } else if (this.cursors?.up.isDown) {
      this.player.mover.tryMove(Direction.UP)
    } else if (this.cursors?.down.isDown) {
      this.player.mover.tryMove(Direction.DOWN)
    }
  }
}