import { MovementCommands } from "./Movable"
import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export type interactionCommand = {
  type: 'dialogue' | 'animation' | 'transition' | 'move' | 'function',
  condition?: {
    var: string,
    value: number,
  },
  dialogue?: {
    type: 'text' | 'choice',
    text?: string[],
    choice?: string[],
    var?: string,
  },
  animation?: string,
  transition?: string,
  move?: MovementCommands,
  function?: () => void
} // TODO: is there a way to enforce whatever data is required via TS?

export interface Interactee {
  interact: () => void
}