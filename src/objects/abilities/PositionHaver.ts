import { Settings } from "../../settings/Settings"

export interface PositionHaver {
  sprite: Phaser.GameObjects.Sprite
  beer: Beer // TODO: ... this naming system kinda bad
}

export class Beer {
  private parentSprite: Phaser.GameObjects.Sprite
  private tilePos: Phaser.Math.Vector2
  private collidable: boolean

  constructor(parent: PositionHaver, tileX: number, tileY: number, collidable: boolean = true) {
    this.parentSprite = parent.sprite

    parent.sprite.setOrigin(0.5, 1)
    const offsetX = Settings.getTileSize() / 2
    const offsetY = Settings.getTileSize()
    parent.sprite.setPosition(
      tileX * Settings.getTileSize() + offsetX,
      tileY * Settings.getTileSize() + offsetY
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

  isCollidable() {
    return this.collidable
  }
}