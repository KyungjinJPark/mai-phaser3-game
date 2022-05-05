import { ObjectManager } from "../managers/ObjectManager"
import { Collidability } from "../types/Collidability"
import { BaseObject } from "./BaseObject"

export class Partier extends BaseObject {
  public constructor(scene: Phaser.Scene, objManager: ObjectManager, x: number, y: number, imageKey: string) {
    super(scene, objManager, true, imageKey, 1, { tileX: x, tileY: y, collidability: Collidability.TO_NON_PLAYERS }, undefined, { isPlayer: false, moveCmds: undefined })
  }
}