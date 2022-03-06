import { Settings } from "../settings/Settings"

export class NPC {
  constructor( // TODO: wet code
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


}