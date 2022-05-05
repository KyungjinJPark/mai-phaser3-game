import { ObjectManager } from "../managers/ObjectManager"
import { Collidability } from "../types/Collidability"
import { InteractionCommand } from "./abilities/Interactable"
import { MovementCommands } from "./abilities/Movable"
import { BaseObject } from "./BaseObject"

export class NPC extends BaseObject {
  public constructor(scene: Phaser.Scene, objManager: ObjectManager, x: number, y: number, imageKey: string, interactCmds?: InteractionCommand[], moveCmds?: MovementCommands) {
    super(scene, objManager, true, imageKey, 55, { tileX: x, tileY: y, collidability: Collidability.YES }, { interactCmds }, { isPlayer: false, moveCmds })
  }
}