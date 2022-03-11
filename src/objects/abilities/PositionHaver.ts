import { Settings } from "../../settings/Settings"

export interface PositionHaver {
  beer: Beer // TODO: ... this naming system kinda bad
}

export class Beer {
  private parentSprite: any // TODO: this seems like bad practice // any -> GameObject
  private tilePos: Phaser.Math.Vector2

  constructor(parent, tileX: number, tileY: number) {
    this.parentSprite = parent.sprite // TODO: no guarantee that there is a sprite

    parent.sprite.setOrigin(0.5, 1)
    const offsetX = Settings.getTileSize() / 2
    const offsetY = Settings.getTileSize() // TODO: what are these for?
    parent.sprite.setPosition(
      tileX * Settings.getTileSize() + offsetX,
      tileY * Settings.getTileSize() + offsetY
    )

    this.tilePos = new Phaser.Math.Vector2(tileX, tileY)
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
}