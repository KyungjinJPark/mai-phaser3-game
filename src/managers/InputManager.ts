import { GridPhysics } from "../systems/GridPhysics"
import { Direction } from "../types/Direction"
import { Player } from "../objects/Player"
import { CanMove } from "../types/CanMove"
import { Partier } from "../objects/Partier"

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private allCommands: Direction[]
  private commandsThisFrame: Direction[]
  // private keysDownLastTick: Direction[]
  // private lastMove: Direction
  // private newMoves: Direction[]
  private player: Player
  private partiers: Partier[]
  private moveQueue: Direction[]

  constructor(input: Phaser.Input.InputPlugin) {
    this.cursors = input.keyboard.createCursorKeys()
    this.allCommands = []
    this.commandsThisFrame = []
    // this.keysDownLastTick = []
    // this.newMoves = []
    this.partiers = []
    this.moveQueue = []
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
    let moveDir

    const numCommandsThisFrame = this.commandsThisFrame.length
    if (numCommandsThisFrame !== 0) {
      moveDir = this.commandsThisFrame[numCommandsThisFrame - 1]
    } else {
      const numAllCommands = this.allCommands.length
      if (numAllCommands !== 0) {
        moveDir = this.allCommands[numAllCommands - 1]
      }
    }
    
    if (moveDir !== undefined) {
      const canMove = this.player.mover.canMove(moveDir)
      if (canMove === CanMove.YES) {
        moveSucc = this.doMove(moveDir) 
      } else if (canMove === CanMove.COLLIDES) {
        this.player.mover.tryMove(moveDir)
        moveSucc = true
      }
    }
      
    if (moveSucc) {
      this.commandsThisFrame = []
    }
  }

  private doMove(moveDir: Direction) {
    const moveSucc = this.player.mover.tryMove(moveDir)
    this.moveQueue.forEach((dir, i) => {
      this.partiers.at(i).mover.tryMove(dir)
    })

    if (moveSucc) {
      console.log(this.moveQueue.toString())

      this.moveQueue.splice(0, 0, moveDir)
      if (this.moveQueue.length > this.partiers.length) {
        this.moveQueue.pop()
      }
    }
    return moveSucc
  }

  setPlayer(player: Player) {
    this.player = player
  }

  setPartier(partier: Partier, index?: number) {
    if (index !== undefined) {
      this.partiers.splice(index, 0, partier)
    } else {
      this.partiers.push(partier)
    }
  }
}