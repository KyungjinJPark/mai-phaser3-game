import { GridPhysics } from "../systems/GridPhysics"
import { Direction } from "../types/Direction"
import { Player } from "../objects/Player"

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private keysDownLastTick: Direction[]
  private lastMove: Direction
  private nextMove: Direction
  private player: Player

  constructor(input: Phaser.Input.InputPlugin) {
    this.cursors = input.keyboard.createCursorKeys()
    this.keysDownLastTick = []
    this.create()
  }

  create() {
    this.cursors.space.on('down', () => {
      this.player.tryInteract()
    })
  }

  update() {
    // TOmaybeDO: do most recent action when many keys are pressed
    const keysDownThisTick = []
    if (this.cursors.right.isDown) {
      keysDownThisTick.push(Direction.RIGHT)
    }
    if (this.cursors.left.isDown) {
      keysDownThisTick.push(Direction.LEFT)
    }
    if (this.cursors.up.isDown) {
      keysDownThisTick.push(Direction.UP)
    }
    if (this.cursors.down.isDown) {
      keysDownThisTick.push(Direction.DOWN)
    }

    if (keysDownThisTick.length !== 0) { // if you are hitting keys
      const diff = keysDownThisTick.filter(key => !this.keysDownLastTick.includes(key))

      if (diff.length === 0) {
        if (keysDownThisTick.length === this.keysDownLastTick.length) { // hitting same keys
          this.nextMove = this.lastMove
        } else { // hitting less keys
          if (keysDownThisTick.includes(this.lastMove)) { // if the current direction is still down
            this.nextMove = this.lastMove
          } else { // go whatever direction
            this.nextMove = keysDownThisTick[0]
          }
        }
      } else { // if you are hitting new keys
        if (diff.includes(Direction.RIGHT)) {
          this.nextMove = Direction.RIGHT
        } else if (diff.includes(Direction.LEFT)) {
          this.nextMove = Direction.LEFT
        } else if (diff.includes(Direction.UP)) {
          this.nextMove = Direction.UP
        } else if (diff.includes(Direction.DOWN)) {
          this.nextMove = Direction.DOWN
        }
      }
    } else {
      this.nextMove = Direction.NONE
    }

    if (this.nextMove !== Direction.NONE) {
      this.player.mover.tryMove(this.nextMove)
    }

    this.lastMove = this.nextMove
    this.keysDownLastTick = keysDownThisTick
  }

  setPlayer(player: Player) {
    this.player = player
  }
}