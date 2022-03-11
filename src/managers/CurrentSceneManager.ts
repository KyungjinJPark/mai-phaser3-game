export class CurrentSceneManager {
  // Singleton code
  private static instance: CurrentSceneManager
  public static getInstance(): CurrentSceneManager {
    if (!CurrentSceneManager.instance) {
      throw new Error("singleton instance does not exist")
      // CurrentSceneManager.singleton = new CurrentSceneManager()
    }
    return CurrentSceneManager.instance
  }

  private currentScene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.currentScene = scene
    CurrentSceneManager.instance = this
  }

  getCurrentScene(): Phaser.Scene {
    return this.currentScene
  }
  setCurrentScene(scene: Phaser.Scene) {
    this.currentScene = scene
  }
}