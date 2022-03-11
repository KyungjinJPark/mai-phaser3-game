export interface Interactable {
  interactee: Interactee


  getTilePosition() // should be `beer: positionHaver` // TODO: having a position shouldnt be a requirement of interactables


}

export interface Interactee {
  interact: () => void
}