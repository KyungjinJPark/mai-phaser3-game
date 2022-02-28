import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2,
  ) {
    const offsetX = Settings.getTileSize() / 2
    const offsetY = Settings.getTileSize() // what are these for?

    this.sprite.setOrigin(0.5, 1)
    this.sprite.setPosition(
      tilePos.x * Settings.getTileSize() + offsetX,
      tilePos.y * Settings.getTileSize() + offsetY
    )
  }

  getPosition() {
    return this.sprite.getBottomCenter()
  }

  getTilePosition() {
    return this.tilePos.clone()
  }

  setPosition(pos: Phaser.Math.Vector2) {
    this.sprite.setPosition(pos.x, pos.y)
  }

  setTilePosition(pos: Phaser.Math.Vector2) {
    this.tilePos = pos.clone()
    
  }

  startAnimation(direction: Direction) {
    this.sprite.anims.play(direction)
  }

  stopAnimation(direction: Direction) {
    const animForDir = this.sprite.anims.animationManager.get(direction)
    const idleFrame = animForDir.frames[1].frame.name
    this.sprite.anims.stop()
    this.sprite.setFrame(idleFrame)
  }
}