import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export type interactionCommand = {
  type: 'dialogue' | 'TODO',
  msg?: string
}

export interface Interactee {
  interact: () => void
}