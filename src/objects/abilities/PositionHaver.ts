import { Settings } from "../../settings/Settings"
import { GridPhysics } from "../../systems/GridPhysics"
import { Collidable } from "../../types/Collidable"

export interface PositionHaver {
  sprite: Phaser.GameObjects.Sprite
  beer: Beer // TODO: ... this naming system kinda bad
}

export class Beer {
  private objManager: GridPhysics
  private parentSprite: Phaser.GameObjects.Sprite
  private tilePos: Phaser.Math.Vector2
  private collidable: Collidable

  constructor(parent: PositionHaver, tileX: number, tileY: number, collidable: Collidable = Collidable.YES) {
    this.parentSprite = parent.sprite

    parent.sprite.setOrigin(0.5, 1)
    const offsetX = Settings.tileSize / 2
    const offsetY = Settings.tileSize
    parent.sprite.setPosition(
      tileX * Settings.tileSize + offsetX,
      tileY * Settings.tileSize + offsetY
    )

    this.tilePos = new Phaser.Math.Vector2(tileX, tileY)
    this.collidable = collidable
  }
  
  getPosition() {
    return this.parentSprite.getBottomCenter()
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setPosition(pos: Phaser.Math.Vector2) {
    this.parentSprite.setPosition(pos.x, pos.y)
  }

  setTilePosition(pos: Phaser.Math.Vector2) {
    this.tilePos = pos.clone()
  }

  getCollidableType(): Collidable {
    return this.collidable
  }

  assignObjManager(objManager: GridPhysics) { // TODO: can I reorder construction to avoid needing this?
    this.objManager = objManager
  }

  getObjManager() {
    return this.objManager
  }

  destroy() {
    this.objManager.remove(this)
  }
}