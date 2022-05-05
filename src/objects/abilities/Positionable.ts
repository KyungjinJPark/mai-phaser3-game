import { Settings } from "../../settings/Settings"
import { Collidability } from "../../types/Collidability"
import { BaseObject } from "../BaseObject"

export interface Positionable extends BaseObject {
  positionAbility: PositionAbility
}

export class PositionAbility {
  private parent: BaseObject
  private _tilePos: Phaser.Math.Vector2
  private _collidability: Collidability

  constructor(parent: BaseObject, tileX: number, tileY: number, collidability: Collidability = Collidability.YES) {
    this.parent = parent
    
    // Align `tilePos` to Phaser pos
    this.tilePos = new Phaser.Math.Vector2(tileX, tileY)
    parent.gameObject.setOrigin(0.5, 1) // origin is bottom-center
    parent.gameObject.setPosition(
      (tileX * Settings.tileSize) + Settings.tileSize / 2,
      (tileY * Settings.tileSize) + Settings.tileSize
    )

    // Set collidability
    this._collidability = collidability
  }

  public get gamePos(): Phaser.Math.Vector2 {
    return this.parent.gameObject.getBottomCenter() // TODO: is there no get Position?
  }

  public set gamePos(pos: Phaser.Math.Vector2) {
    this.parent.gameObject.setPosition(pos.x, pos.y)
  }

  public get tilePos() {
    return this._tilePos.clone()
  }

  public set tilePos(pos: Phaser.Math.Vector2) {
    this._tilePos = pos.clone()
  }

  public get collidability(): Collidability {
    return this._collidability
  }
}