type optionalParameters = {
  borderThickness?: number,
  borderColor?: number,
  borderAlpha?: number,
  windowAlpha?: number,
  windowColor?: number,
  windowHeight?: number,
  padding?: number,
  closeBtnColor?: number,
  dialogSpeed?: number,
}

export class DialogueModalPlugin extends Phaser.Plugins.BasePlugin {
  private options: optionalParameters & object = {
    borderThickness: 3,
    borderColor: 0x907748,
    borderAlpha: 1,
    windowAlpha: 0.8,
    windowColor: 0x303030,
    windowHeight: 200,
    padding: 16,
    closeBtnColor: 0x907748,
    dialogSpeed: 3
  }
  private graphics: Phaser.GameObjects.Graphics
  private closeBtn: Phaser.GameObjects.Text
  private visible: boolean
  private timedEvent: Phaser.Time.TimerEvent
  private dialogueSpeed: number = 4
  private currentText
  private fullText: string[]
  private eventCounter

  constructor(pluginManager) {
    super(pluginManager)
  } 

  init(opts: optionalParameters): void { // optional parameters
    if (!opts) {
      for (const param in opts) {
        this.options[param] = opts[param]
      }
    }
  }

  private _getGameWidth(): number {
    return this.game.scale.width
  }
  
  private _getGameHeight(): number {
    return this.game.scale.height
  }

  private _getActiveScene(): Phaser.Scene {
    const hudSceneKey = 'HUDScene'
    const hudScene = this.game.scene.getScene(hudSceneKey)
    if (hudScene === undefined || !this.game.scene.isActive(hudSceneKey)) {
      // This can happen only if im not making things properly
      console.error('DialogueModalPlugin: Could not find HUDScene OR HUDScene is not active')
      throw new Error('DialogueModalPlugin: Could not find HUDScene OR HUDScene is not active')
    }
    return hudScene
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

  private _createCloseBtn(width: number, height: number) {
    const self = this
    this.closeBtn = this._getActiveScene().make.text({
      x: width - this.options.padding - 18,
      y: height - this.options.padding - this.options.windowHeight + 6,
      text: 'X',
      style: {
        font: 'bold 16px Arial',
        color: this.options.closeBtnColor.toString(),
      }
    })
    this.closeBtn.setDepth(200) // TODO: there's gotta be a better way

    this.closeBtn.setInteractive()
    this.closeBtn.on('pointerover', function () {
      self.closeBtn.setColor('#ff0000')
    })
    this.closeBtn.on('pointerout', function () {
      self.closeBtn.setColor(self.options.closeBtnColor.toString())
    })
    this.closeBtn.on('pointerdown', () => {
      self._toggleWindow()
      if (this.timedEvent) this.timedEvent.remove()
      if (this.currentText) this.currentText.destroy()
    })
  }

  private _createCloseBtnBorder(width: number, height: number) {
    const x = width - this.options.padding - 18
    const y = height - this.options.padding - this.options.windowHeight
    this.graphics.strokeRect(x, y, 18, 18)
  }

  private _createWindow() {
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const {x, y, boxWidth, boxHeight} = this._calculateWindowDimensions(gameWidth, gameHeight)
    const activeScene = this._getActiveScene()
    if (activeScene) {
      this.graphics = activeScene.add.graphics()
      this.graphics.setDepth(200) // TODO: there's gotta be a better way
  
      this._createInnerWindow(x, y, boxWidth, boxHeight)
      this._createOuterWindow(x, y, boxWidth, boxHeight)
      this._createCloseBtn(gameWidth, gameHeight)
      this._createCloseBtnBorder(gameWidth, gameHeight)
    }
  }

  private _toggleWindow() {
    this.visible = !this.visible
    
    if (this.currentText) {
      this.currentText.setVisible(this.visible)
    }
    this.closeBtn.setVisible(this.visible)
    this.graphics.setVisible(this.visible)

  }

  createDialogueBox(): void {
    this.visible = true
    this._createWindow()
  }

  setText(text: string, animate: boolean) {
    this.eventCounter = 0

    if (animate) {
      this._setText('')
      this.fullText = Array.from(text)
      
      if (this.timedEvent) this.timedEvent.destroy()
      this.timedEvent = this._getActiveScene().time.addEvent({
        delay: 150 - (this.dialogueSpeed * 30), // TODO: this could be better
        callback: this._animateText,
        callbackScope: this,
        loop: true
      })
    } else { 
      this._setText(text)
    }
  }

  private _animateText() {
    this.currentText.setText(this.currentText.text + this.fullText[this.eventCounter])
    if (this.eventCounter === this.fullText.length - 1) {
      this.timedEvent.remove()
    }
    this.eventCounter++
  }

  private _setText(text: string) {
    if (this.currentText) {this.currentText.destroy()}

    const x = this.options.padding + 10
    const y = this._getGameHeight() - this.options.windowHeight - this.options.padding + 10
    this.currentText = this._getActiveScene().make.text({
      x, y, text, style: {
        wordWrap: { width: this._getGameWidth() - (2 * this.options.padding) - 25},
        fontSize: '18px',
        color: '#ffffff'
      }
    }).setDepth(200) // TODO: there's gotta be a better way
  }

  destroy(): void {
    // TODO: do I need to destroy all the things?
  }

  start(): void {}

  stop(): void {
    if (this.timedEvent) this.timedEvent.remove()
    if (this.currentText) this.currentText.destroy()
  }
}
