import { Settings } from "../settings/Settings"
import { Direction } from "../types/Direction"
import { DialogueManager } from "../managers/DialogueManager"
import { Interactable } from "../objects/Interactable"
import { Player } from '../objects/Player'

// aliases
const Vector2 = Phaser.Math.Vector2
type Vector2 = Phaser.Math.Vector2

export class GridPhysics { // custom physics engine
  private movingDirection: Direction = Direction.NONE
  private movingIntent: Direction = Direction.NONE
  private movePixelsPerSecond: number = 350
  private directionVectors: { [key in Direction]: Vector2 } = {
    [Direction.NONE]: new Vector2(0, 0),
    [Direction.RIGHT]: new Vector2(1, 0),
    [Direction.UP]: new Vector2(0, -1),
    [Direction.LEFT]: new Vector2(-1, 0),
    [Direction.DOWN]: new Vector2(0, 1)
  }
  private tilePixelsMoved = 0
  private facingDirection: Direction = Direction.NONE
  private interactables: { [key: string]: Interactable } = {}

  constructor(private player: Player, private map: Phaser.Tilemaps.Tilemap) {}

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta)
    }
    this.movingIntent = Direction.NONE
  }

  movePlayer(direction: Direction) { // public by default
    this.movingIntent = direction
    if (this.isMoving()) {
      return
    } else if (this.isBlockedInDir(direction)) {
      this.player.stopAnimation(direction)
      this.facingDirection = direction
    } else {
      this.startMoving(direction)
      this.facingDirection = direction
    }
  }

  isMoving(): boolean {
    return this.movingDirection !== Direction.NONE
  }

  startMoving(direction: Direction) {
    this.player.startAnimation(direction)
    this.movingDirection = direction
    this.updatePlayerTilePos()
  }

  stopMoving() {
    this.player.stopAnimation(this.movingDirection)
    this.movingDirection = Direction.NONE
  }

  updatePlayerPosition(delta: number) {
    const deltaInSec = delta / 1000
    const pixelsToMove = deltaInSec * this.movePixelsPerSecond

    if (!this.willCrossBorder(pixelsToMove)) {
      this.movePlayerSprite(pixelsToMove)
    } else if (this.shouldContinueMove()) { // has moving intention
      this.movePlayerSprite(pixelsToMove)
      this.updatePlayerTilePos()
    } else {
      this.movePlayerSprite(Settings.getTileSize() - this.tilePixelsMoved)
      this.stopMoving()
    }
  }

  private shouldContinueMove() {
    return (
      this.movingIntent === this.movingDirection &&
      !this.isBlockedInDir(this.movingDirection)
    )
  }

  private isBlockedInDir(dir: Direction): boolean {
    return this.hasCollisionTile(this.tilePosInDir(dir))
  }

  private tilePosInDir(dir: Direction): Vector2 {
    return this.player.getTilePosition().add(this.directionVectors[dir])
  }

  private hasCollisionTile(tilePos: Vector2): boolean {
    if (!this.mapHasTileAt(tilePos)) return true
    return this.map.layers.some((layer) => {
      const tile = this.map.getTileAt(tilePos.x, tilePos.y, false, layer.name)
      return tile && tile.properties.collides
    })
  }

  mapHasTileAt(tilePos: Phaser.Math.Vector2) {
    return this.map.layers.some((layer) => {
      return this.map.hasTileAt(tilePos.x, tilePos.y, layer.name)
    })
  }

  updatePlayerTilePos() {
    this.player.setTilePosition(
      this.player.getTilePosition().add(this.directionVectors[this.movingDirection])
    )
  }

  private willCrossBorder(pixelsToMove: number): boolean {
    return this.tilePixelsMoved + pixelsToMove >= Settings.getTileSize()
  }

  private movePlayerSprite(pixelsToMove: number) {
    const moveVect = this.directionVectors[this.movingDirection].clone()
    const newPos = this.player.getPosition().add(moveVect.scale(pixelsToMove))
    this.tilePixelsMoved += pixelsToMove
    this.tilePixelsMoved %= Settings.getTileSize()
    this.player.setPosition(newPos)
  }

  // Interactables
  registerInteractables(interactables: { [key: string]: Interactable }) {
    this.interactables = interactables
    for (const param in interactables) {
      this.interactables[param] = interactables[param]
    }
  }

  playerInteract() {
    if (this.isMoving()) {
      return
    } else {
      const interactable = this.getInteractableAt(this.tilePosInDir(this.facingDirection))
      if (interactable !== undefined) {
        interactable.interact()
      }
    }
  }

  private getInteractableAt(tilePos: Vector2): Interactable {
    // console.log(`${tilePos.x},${tilePos.y}`)
    return this.interactables[`${tilePos.x},${tilePos.y}`]
  }
}