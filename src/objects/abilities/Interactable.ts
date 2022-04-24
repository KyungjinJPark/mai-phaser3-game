import { MovementCommands } from "./Movable"
import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export type interactionCommand = {
  type: 'dialogue' | 'animation' | 'transition' | 'move' | 'function',
  dialogue?: string[],
  animation?: string,
  transition?: string,
  move?: MovementCommands,
  function?: () => void
} // TODO: is there a way to enforce the requirement?

export interface Interactee {
  interact: () => void
}