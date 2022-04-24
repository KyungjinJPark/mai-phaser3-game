import { Direction } from "../types/Direction"
import { CurrentSceneManager } from "./CurrentSceneManager"
import { Party } from "../objects/Party"

export class InputManager {
  private disabled: boolean
  private input: Phaser.Input.InputPlugin
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private allCommands: Direction[]
  private commandsThisFrame: Direction[]
  private party: Party

  constructor(input: Phaser.Input.InputPlugin) {
    this.disabled = false
    this.input = input
    this.cursors = input.keyboard.createCursorKeys()
    this.allCommands = []
    this.commandsThisFrame = []
    this.create()
  }

  disableControls = () => {
    if (!this.disabled) {
      this.disabled = true
      this.allCommands = []
      this.commandsThisFrame = []
      this.cursors.space.removeAllListeners()
      this.cursors.right.removeAllListeners()
      this.cursors.up.removeAllListeners()
      this.cursors.left.removeAllListeners()
      this.cursors.down.removeAllListeners()
    }
  }

  enableControls = () => {
    if (this.disabled) {
      this.disabled = false
      this.create()
    }
  }

  create() {
    // TODO: Input manager getting a bit too coupled with other systems

    // Pause game
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      // new Phaser.Events.EventEmitter()
      CurrentSceneManager.getInstance().getCurrentScene().scene.pause()
    })

    // Interact controls
    this.cursors.space.on('down', () => {
      console.log('InputManager tryInteract')
      this.party.player.tryInteract()
    })

    // Movement controls
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
    const moveDir = this.getCurrentMove()
    if (moveDir !== undefined) {
      if (this.party.tryMove(moveDir)) {
        this.commandsThisFrame = []
      }
    }
  }

  private getCurrentMove() {
    let moveDir: Direction = undefined
    const numCommandsThisFrame = this.commandsThisFrame.length
    if (numCommandsThisFrame !== 0) {
      moveDir = this.commandsThisFrame[numCommandsThisFrame - 1]
    } else {
      const numAllCommands = this.allCommands.length
      if (numAllCommands !== 0) {
        moveDir = this.allCommands[numAllCommands - 1]
      }
    }
    return moveDir
  }

  setParty(party: Party) {
    this.party = party
  }
}