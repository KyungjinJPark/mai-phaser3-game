import { Beer } from "./PositionHaver"

export interface Interactable {
  beer: Beer
  interactee: Interactee
}

export interface Interactee {
  interact: () => void
}