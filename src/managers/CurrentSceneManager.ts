import { BaseGameScene } from "../scenes/BaseGameScene"

export class CurrentSceneManager {
  private static _scene: BaseGameScene
  
  public static get scene(): BaseGameScene {
    return CurrentSceneManager._scene
  }
  public static set scene(scene: BaseGameScene) {
    CurrentSceneManager._scene = scene
  }
}