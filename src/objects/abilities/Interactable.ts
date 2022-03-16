import { PositionHaver } from "./PositionHaver"

export interface Interactable extends PositionHaver{
  interactee: Interactee
}

export interface Interactee {
  interact: () => void
}