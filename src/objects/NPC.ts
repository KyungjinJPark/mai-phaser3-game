import { CurrentSceneManager } from "../managers/CurrentSceneManager"
import { DialogueManager } from "../managers/DialogueManager"
import { Settings } from "../settings/Settings"
import { Beer, PositionHaver } from "./abilities/PositionHaver"
import { Movable, GridMover, MovementCommands } from "./abilities/Movable"
import { Interactable, Interactee, interactionCommand } from "./abilities/Interactable"

export class NPC implements PositionHaver, Movable, Interactable {
  public sprite: Phaser.GameObjects.Sprite
  public beer: Beer
  public mover: GridMover
  public interactee: Interactee
  private spriteKey: string 
  
  constructor(x: number, y: number, spriteKey: string, interactionCommands?: interactionCommand[], private movementCommands?: MovementCommands) {
    this.spriteKey = spriteKey
    const thisScene = CurrentSceneManager.getInstance().getCurrentScene()
    this.sprite = thisScene.add.sprite(0, 0, spriteKey, 55)
    this.sprite.setDepth(25)
    this.sprite.scale = Settings.zoom
    this.beer = new Beer(this, x, y)
    this.mover = new GridMover(this, this.spriteKey)
    this.mover.setMovementCommands(this.movementCommands)
    
    this.interactee = new Interactee(this, interactionCommands)
  }

  update(delta: number) {
    if (this.mover !== undefined) {
      this.mover.update(delta)
    }
  }
}