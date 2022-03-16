import { GridPhysics } from "../systems/GridPhysics"
import { Direction } from "../types/Direction"
import { Player } from "../objects/Player"
import { CanMove } from "../types/CanMove"

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private allCommands: Direction[]
  private commandsThisFrame: Direction[]
  // private keysDownLastTick: Direction[]
  // private lastMove: Direction
  // private newMoves: Direction[]
  private player: Player

  constructor(input: Phaser.Input.InputPlugin) {
    this.cursors = input.keyboard.createCursorKeys()
    this.allCommands = []
    this.commandsThisFrame = []
    // this.keysDownLastTick = []
    // this.newMoves = []
    this.create()
  }

  create() {
    this.cursors.space.on('down', () => {
      this.player.tryInteract()
    })

    this.cursors.right.on('down', () => {
      this.allCommands.push(Direction.RIGHT)
      this.commandsThisFrame.push(Direction.RIGHT)
    })
    this.cursors.right.on('up', () => {
      const resolve = this.allCommands.indexOf(Direction.RIGHT)
      if (resolve !== -1) {
        this.allCommands.splice(resolve, 1)
      }
    })

    this.cursors.up.on('down', () => {
      this.allCommands.push(Direction.UP)
      this.commandsThisFrame.push(Direction.UP)
    })
    this.cursors.up.on('up', () => {
      const resolve = this.allCommands.indexOf(Direction.UP)
      if (resolve !== -1) {
        this.allCommands.splice(resolve, 1)
      }
    })

    this.cursors.left.on('down', () => {
      this.allCommands.push(Direction.LEFT)
      this.commandsThisFrame.push(Direction.LEFT)
    })
    this.cursors.left.on('up', () => {
      const resolve = this.allCommands.indexOf(Direction.LEFT)
      if (resolve !== -1) {
        this.allCommands.splice(resolve, 1)
      }
    })

    this.cursors.down.on('down', () => {
      this.allCommands.push(Direction.DOWN)
      this.commandsThisFrame.push(Direction.DOWN)
    })
    this.cursors.down.on('up', () => {
      const resolve = this.allCommands.indexOf(Direction.DOWN)
      if (resolve !== -1) {
        this.allCommands.splice(resolve, 1)
      }
    })
  }

  update() {
    let moveSucc = false

    const numCommandsThisFrame = this.commandsThisFrame.length
    if (numCommandsThisFrame !== 0) {
      const moveDir = this.commandsThisFrame[numCommandsThisFrame - 1]
      const canMove = this.player.mover.canMove(moveDir)
      if (canMove === CanMove.YES) {
        moveSucc = this.player.mover.tryMove(moveDir)
      } else if (canMove === CanMove.COLLIDES) {
        this.player.mover.tryMove(moveDir)
        moveSucc = true
      }
    } else {
      const numAllCommands = this.allCommands.length
      if (numAllCommands !== 0) {
        moveSucc = this.player.mover.tryMove(this.allCommands[numAllCommands - 1])
      }
    }

    if (moveSucc) {
      this.commandsThisFrame = []
    }
  }

  setPlayer(player: Player) {
    this.player = player
  }
}