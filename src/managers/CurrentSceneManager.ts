export class CurrentSceneManager {
  // Singleton code
  private static instance: CurrentSceneManager
  public static getInstance(): CurrentSceneManager {
    if (!CurrentSceneManager.instance) {
      CurrentSceneManager.instance = new CurrentSceneManager()
    }
    return CurrentSceneManager.instance
  }

  private currentScene: Phaser.Scene

  private constructor() {
    CurrentSceneManager.instance = this
  }

  getCurrentScene(): Phaser.Scene {
    return this.currentScene
  }
  setCurrentScene(scene: Phaser.Scene) {
    this.currentScene = scene
  }
}