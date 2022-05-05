import { Collidability } from "../types/Collidability"
import { Positionable } from "../objects/abilities/Positionable"
import { Interactable } from "../objects/abilities/Interactable"
import { Movable } from "../objects/abilities/Movable"
import { BaseObject } from "../objects/BaseObject"

/**
 * An `ObjectManager` knows of all objects in its scene. It knows about the
 * collidable map tiles and objects. It also keeps track of interactable
 * objects to pass to any interactor (likely the player).
 */
export class ObjectManager {
  private map: Phaser.Tilemaps.Tilemap
  // private objects: BaseObject[] = []
  private positionables: BaseObject[] = []
  private interactables: Interactable[] = []

  public registerObj(obj: BaseObject) {
    // this.objects.push(obj)
    if (obj.positionAbility) {
      this.registerPositionable(obj)
    }
    if (obj.interactAbility) {
      this.registerInteractable(obj)
    }
  }

  public remove(remObj: BaseObject) {
    const ii = this.interactables.findIndex(obj => obj === remObj) // assumes unique objects for diffferent objects
    if (ii != -1) {
      this.interactables.splice(ii, 1)
    }
    const mi = this.positionables.findIndex(obj => obj === remObj)
    if (mi != -1) {
      this.positionables.splice(mi, 1)
    }
  }
  
  // Map
  public setMap(map: Phaser.Tilemaps.Tilemap) {
    this.map = map
  }

  // Positionables
  private registerPositionable(obj: BaseObject) {
    this.positionables.push(obj)
  }

  // Interactables
  private registerInteractable(interactable: Interactable) {
    this.interactables.push(interactable)
  }

  public getInteractableAt(tilePos: Phaser.Math.Vector2): Interactable {
    for (const interactable of this.interactables) {
      if (interactable.positionAbility.tilePos.equals(tilePos)) {
        return interactable
      }
    }
    return undefined
  }

  // Movables
  public getCollidabilityAt(tilePos: Phaser.Math.Vector2): Collidability[] {
    // does map collision tile here? // TODO: what did this code do again?
    if (!this.mapHasTileAt(tilePos)) return [Collidability.YES]
    const answer = this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return (tile && tile.properties.collides)
    })
    if (answer) return [Collidability.YES]

    // is there a registered collidable here?
    const collideTypes = new Set()
    this.positionables.forEach(obj => {
      if (obj.positionAbility.tilePos.equals(tilePos)) {
        collideTypes.add(obj.positionAbility.collidability)
      }
    })
    const types: Collidability[] = Array.from(collideTypes) as any
    return types
  }

  private mapHasTileAt(tilePos: Phaser.Math.Vector2) {
    return this.map.layers.some((layer) => {
      return this.map.hasTileAt(tilePos.x, tilePos.y, layer.name)
    })
  }
}