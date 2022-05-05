import { ObjectManager } from "../managers/ObjectManager"
import { Collidability } from "../types/Collidability"
import { BaseObject } from "./BaseObject"

export class Player extends BaseObject {
  public constructor(scene: Phaser.Scene, objManager: ObjectManager, x: number, y: number, imageKey: string) {
    super(scene, objManager, true, imageKey, 1, { tileX: x, tileY: y, collidability:Collidability.YES }, undefined, { isPlayer: true, moveCmds: undefined })
  }

  public tryInteract() {
    if (!this.moveAbility.isMoving()) {
      const interactSpot = this.moveAbility.tilePosInDir(this.moveAbility.getFacingDirection())
      const interactable = this.objManager.getInteractableAt(interactSpot)
      if (interactable !== undefined) {
        interactable.interactAbility.interact()
      }
    }
  }
}