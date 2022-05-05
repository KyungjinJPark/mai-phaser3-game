import { ObjectManager } from "../managers/ObjectManager"
import { Collidability } from "../types/Collidability"
import { InteractionCommand } from "./abilities/Interactable"
import { BaseObject } from "./BaseObject"

export class SimpleInteractable extends BaseObject {
  constructor(scene: Phaser.Scene, objManager: ObjectManager, x: number, y: number, imageKey: string, interactCmds: InteractionCommand[]) {
    super(scene, objManager, false, imageKey, 0, { tileX: x, tileY: y, collidability: Collidability.YES }, { interactCmds }, undefined)
  }
}