import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Movable, GridMover } from "../objects/abilities/Movable"
import { Interactable } from "../objects/abilities/Interactable"
import { Player } from '../objects/Player'

// aliases

export class GridPhysics { // custom physics system
  constructor(
    private map: Phaser.Tilemaps.Tilemap,
    private interactables: Interactable[],
    private movables: Movable[]
  ) {
    this.movables.forEach(movable => {
      movable.initMover(this)
    })
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

  hasCollisionTileAt(tilePos: Phaser.Math.Vector2): boolean {
    let answer = false
    // does map collision tile here?
    if (!this.mapHasTileAt(tilePos)) return true
    answer = answer || this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return (tile && tile.properties.collides)
    })
    // is there a dude here?
    this.movables.forEach(movable => { // TODO: assumes all movables are collidable (also that non-movables are not collidable)
      const personHere = movable.beer.getTilePosition().equals(tilePos) // TODO: assumes all movables have positions, which should be true, but not enforced in code
      answer = answer || personHere
    })
    return answer
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