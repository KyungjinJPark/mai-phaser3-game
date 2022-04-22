import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export type interactionCommand = {
  type: 'dialogue' | 'animation' | 'transition' | 'function',
  dialogue?: string,
  animation?: string,
  transition?: string,
  function?: () => void
}

export interface Interactee {
  interact: () => void
}