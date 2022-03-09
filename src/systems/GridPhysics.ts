import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { Movable, GridMover } from "../objects/Movable"
import { Interactable } from "../objects/Interactable"
import { Player } from '../objects/Player'

// aliases

export class GridPhysics { // custom physics system
  constructor(
    private map: Phaser.Tilemaps.Tilemap,
    private interactables: { [key: string]: Interactable },
    private movables: Movable[]
  ) {
    this.movables.forEach(movable => {
      movable.initMover(this)
    })
  }

  update(delta: number) { // public by default
    this.movables.forEach(movable => {
      movable.mover.update(delta)
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
    if (!this.mapHasTileAt(tilePos)) return true
    return this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return tile && tile.properties.collides
    })
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
    // console.log(`${tilePos.x},${tilePos.y}`)
    return this.interactables[`${tilePos.x},${tilePos.y}`]
  }
}