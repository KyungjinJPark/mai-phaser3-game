import { Movable } from "../objects/abilities/Movable"
import { Interactable } from "../objects/abilities/Interactable"
import { Collidable } from "../types/Collidable"
import { Beer, PositionHaver } from "../objects/abilities/PositionHaver"

export class ObjectManager { // world state manager for physics system
  constructor(
    private map: Phaser.Tilemaps.Tilemap,
    private interactables: Interactable[],
    private movables: Movable[]
  ) {
    const all: PositionHaver[] = [].concat(this.interactables, this.movables)
    all.forEach(obj => {
      obj.beer.assignObjManager(this)
    })
  }

  remove(beer: Beer) {
    const ii = this.interactables.findIndex(obj => obj.beer === beer) // assumes unique beers for diffferent objects
    if (ii != -1) {
      this.interactables.splice(ii, 1)
    }
    const mi = this.movables.findIndex(obj => obj.beer === beer)
    if (mi != -1) {
      this.movables.splice(mi, 1)
    }
  }

  // Movables
  // registerMovables(movables: Movable[]) {
  //   this.movables = movables
  //   // initialize movalbles with a Grid Physics system
  //   this.movables.forEach(movable => {
  //     movable.initMover(this)
  //   })
  //   // // when registering additional
  //   // for (const param in interactables) {
  //   //   this.interactables[param] = interactables[param]
  //   // }
  // }

  getCollisionTypesAt(tilePos: Phaser.Math.Vector2): Collidable[] {
    let answer = false
    // does map collision tile here?
    if (!this.mapHasTileAt(tilePos)) return [Collidable.YES]
    answer = this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return (tile && tile.properties.collides)
    })
    if (answer) return [Collidable.YES]
    // is there a registered collidable here?
    const collideTypes = new Set()
    const registereds: PositionHaver[] = [].concat(this.interactables, this.movables)
    registereds.forEach(obj => {
      if (obj.beer.getTilePosition().equals(tilePos)) {
        collideTypes.add(obj.beer.getCollidableType())
      }
    })
    const types: Collidable[] = Array.from(collideTypes) as any
    return types
  }

  private mapHasTileAt(tilePos: Phaser.Math.Vector2) {
    return this.map.layers.some((layer) => {
      return this.map.hasTileAt(tilePos.x, tilePos.y, layer.name)
    })
  }
  
  // Interactables
  // registerInteractables(interactables: { [key: string]: Interactable }) {
  //   this.interactables = interactables
  //   // // when registering additional
  //   // for (const param in interactables) {
  //   //   this.interactables[param] = interactables[param]
  //   // }
  // }

  getInteractableAt(tilePos: Phaser.Math.Vector2): Interactable {
    for (const interactable of this.interactables) {
      if (interactable.beer.getTilePosition().equals(tilePos)) {
        return interactable
      }
    }
    return undefined
  }
}