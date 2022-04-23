import { CanMove } from "../types/CanMove";
import { Direction } from "../types/Direction";
import { Partier } from "./Partier";
import { Player } from "./Player";

export class Party {
  private _player: Player
  private _partiers: Partier[]
  private moveQueue: Direction[]

  constructor(player: Player, partiers: Partier[]) {
    this._player = player
    this._partiers = partiers
    this.moveQueue = []
  }

  public get player(): Player {
    return this._player
  }
  
  public get partiers(): Partier[] {
    return this._partiers
  }

  public update(delta: number) {
    this.player.update(delta)
    this.partiers.forEach((partier) => {
      partier.update(delta)
    })
  }

  public tryMove(moveDir: Direction): boolean {
    const canMove = this.player.mover.canMove(moveDir)
    if (canMove === CanMove.YES) {
      this.moveParty(moveDir) 
      return true
    } else if (canMove === CanMove.COLLIDES) {
      this.player.mover.tryMove(moveDir)
      return true
    } // TOmaybeDO: should it return true if frozen?
    // return false only when the move did nothing
    return false
  }

  private moveParty(moveDir: Direction) {
    // move player
    this.player.mover.move(moveDir)
    // move partiers
    this.moveQueue.forEach((dir, i) => {
      this.partiers[i].mover.move(dir)
    })
    // push new move to queue
    this.moveQueue.splice(0, 0, moveDir)
    if (this.moveQueue.length > this.partiers.length) {
      this.moveQueue.pop()
    }
  }
}