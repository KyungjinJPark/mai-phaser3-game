type optionalParameters = {
  borderThickness?: number,
  borderColor?: number,
  borderAlpha?: number,
  windowAlpha?: number,
  windowColor?: number,
  windowHeight?: number,
  padding?: number,
  closeBtnColor?: string,
  dialogSpeed?: number,
}

export class DialogueModalPlugin extends Phaser.Plugins.BasePlugin {
  private options: optionalParameters & object = {
    borderThickness: 3,
    borderColor: 0x907748,
    borderAlpha: 1,
    windowAlpha: 0.8,
    windowColor: 0x303030,
    windowHeight: 150,
    padding: 32,
    closeBtnColor: 'darkgoldenrod',
    dialogSpeed: 3
  }
  private graphics: Phaser.GameObjects.Graphics
  private eventCounter
  private visible
  private currentText
  private dialog
  private closeBtn

  constructor(pluginManager) {
    super(pluginManager)
  } 

  init(opts: optionalParameters): void { // optional parameters
    if (!opts) {
      for (const param in opts) {
        this.options[param] = opts[param]
      }
    }

    this.eventCounter = 0
    this.visible = true
  }

  private _getGameWidth(): number {
    return this.game.scale.width
  }
  private _getGameHeight(): number {
    return this.game.scale.height
  }
  private _calculateWindowDimensions(width: number, height: number) {
    let x = this.options.padding
    let y = height - this.options.windowHeight - this.options.padding
    let boxWidth = width - (2* this.options.padding)
    let boxHeight = this.options.windowHeight
    return {x, y, boxWidth, boxHeight}
  }
  
  private _createInnerWindow(x, y, rectWidth, rectHeigth) {
    this.graphics.fillStyle(this.options.windowColor, this.options.windowAlpha)
    const offset = 1
    this.graphics.fillRect(x+offset, y+offset, rectWidth-offset, rectHeigth-offset)
  }

  private _createOuterWindow(x, y, rectWidth, rectHeigth) {
    this.graphics.lineStyle(
      this.options.borderThickness,
      this.options.borderColor,
      this.options.borderAlpha
    )
    this.graphics.strokeRect(x, y, rectWidth, rectHeigth)
  }

  private _createWindow() {
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const {x, y, boxWidth, boxHeight} = this._calculateWindowDimensions(gameWidth, gameHeight)
    const activeScene = this.game.scene.getScenes(true)[0]
    if (activeScene) {
      this.graphics = activeScene.add.graphics()
      this.graphics.setDepth(200)
  
      this._createOuterWindow(x, y, boxWidth, boxHeight)
      this._createInnerWindow(x, y, boxWidth, boxHeight)
    }
  }

  createDialogueBox(): void {
    this._createWindow()
  }

  destroy(): void {}

  start(): void {}

  shutdown(): void {}
}
