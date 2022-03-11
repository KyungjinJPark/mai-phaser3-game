import { Beer } from "./PositionHaver"

export interface Interactable {
  interactee: Interactee
  beer: Beer
}

export interface Interactee {
  interact: () => void
}