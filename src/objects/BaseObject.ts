import { Settings } from "../settings/Settings"
import { ObjectManager } from "../managers/ObjectManager"
import { Collidability } from "../types/Collidability"
import { Positionable, PositionAbility } from "./abilities/Positionable"
import { Interactable, InteractAbility, InteractionCommand } from "./abilities/Interactable"
import { Movable, MoveAbility, MovementCommands } from "./abilities/Movable"

export class BaseObject implements Positionable, Interactable, Movable {
  public gameObject: Phaser.GameObjects.Image // Phaser `image` or `sprite`
  public objManager: ObjectManager // TODO: why do I have this connection?
  public positionAbility: PositionAbility
  public interactAbility: InteractAbility
  public moveAbility: MoveAbility
  
  private animated: boolean

  public constructor(
    scene: Phaser.Scene,
    objManager: ObjectManager,
    animated: boolean,
    imageKey: string,
    imageFrame: number,
    positionableArgs: {
      tileX: number,
      tileY: number,
      collidability: Collidability,
    },
    interactableArgs: {
      interactCmds: InteractionCommand[],
    },
    movableArgs: {
      isPlayer: boolean,
      moveCmds: MovementCommands,
    }
  ) {
    // create gameObject to be `image` or `sprite`
    this.animated = animated
    if (animated) {
      this.gameObject = scene.add.sprite(0,0,imageKey, imageFrame)
    } else {
      this.gameObject = scene.add.image(0,0,imageKey, imageFrame)
    }
    this.gameObject.setAlpha(imageKey === '' ? 0 : 1)
    this.gameObject.setDepth(20)
    this.gameObject.setScale(Settings.zoom)

    // set up PositionAbility // TODO: constructs all even if not used & passes undefined
    this.positionAbility = positionableArgs !== undefined
    ? new PositionAbility(this, positionableArgs.tileX, positionableArgs.tileY, positionableArgs.collidability) : undefined
    this.interactAbility = interactableArgs !== undefined
    ? new InteractAbility(this, interactableArgs.interactCmds) : undefined
    this.moveAbility = movableArgs !== undefined
    ? new MoveAbility(this, animated, imageKey, movableArgs.isPlayer, movableArgs.moveCmds) : undefined

    // connect to ObjectManager (WorldObject <---> ObjectManager)
    this.objManager = objManager
    this.objManager.registerObj(this)
  }

  public update(delta: number) {
    this.moveAbility.update(delta)
  }

  public destroy() {
    this.objManager.remove(this)
    this.gameObject.destroy()
    // TODO: do I need to remove field pointers?
  }

  public get sprite(): Phaser.GameObjects.Sprite | undefined {
    return this.animated ? (this.gameObject as Phaser.GameObjects.Sprite) : undefined
  }
}