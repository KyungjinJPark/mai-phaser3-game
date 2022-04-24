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
  private visible: boolean
  private closeBtn: Phaser.GameObjects.Text
  private timedEvent: Phaser.Time.TimerEvent
  private dialogueStepDelay: number = 30
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

  createDialogue(text: string, animate = true): Promise<void> {
    if (this.currentText === undefined) {
      const x = this.options.padding + 10
      const y = this.getGameHeight() - this.options.windowHeight - this.options.padding + 10
      this.currentText = this.getHUDScene().make.text({
        x, y,
        text:'',
        style: {
          wordWrap: { width: this.getGameWidth() - (2 * this.options.padding) - 25},
          fontSize: '18px',
          color: '#ffffff'
        }
      }).setDepth(10)
    }

    const p = new Promise<void>(resolve => {
      this.createDialogueBox(resolve)
    })
    this.setText(text, animate)
    return p
  }

  private createDialogueBox(closeBtnCallback): void {
    if (this.graphics === undefined) {
      this.createWindow(closeBtnCallback)
    } else {
      this.setVisible(true)
    }
    this.visible = true
  }

  private setText(text: string, animate: boolean) {
    this.eventCounter = 0

    if (animate) {
      this.setTextDispay('')
      this.fullText = Array.from(text)
      
      if (this.timedEvent) this.timedEvent.destroy()
      this.timedEvent = this.getHUDScene().time.addEvent({
        delay: this.dialogueStepDelay,
        callback: this.animateText,
        callbackScope: this,
        loop: true
      })
    } else { 
      this.setTextDispay(text)
    }
  }

  private animateText() {
    this.currentText.setText(this.currentText.text + this.fullText[this.eventCounter])
    if (this.eventCounter === this.fullText.length - 1) {
      this.timedEvent.remove()
    }
    this.eventCounter++
  }

  private setTextDispay(text: string) {
    this.currentText.setText(text)
  }

  private setVisible(visibility: boolean) {
    this.visible = visibility
    
    this.currentText.setVisible(visibility)
    this.closeBtn.setVisible(visibility)
    this.graphics.setVisible(visibility)
  }

  private calculateWindowDimensions(width: number, height: number) {
    const x = this.options.padding
    const y = height - this.options.windowHeight - this.options.padding
    const boxWidth = width - (2* this.options.padding)
    const boxHeight = this.options.windowHeight
    return { x, y, boxWidth, boxHeight }
  }
  
  private createWindowBox(x, y, rectWidth, rectHeigth) {
    this.graphics.fillStyle(this.options.windowColor, this.options.windowAlpha)
    this.graphics.fillRect(x, y, rectWidth, rectHeigth)
    this.graphics.lineStyle(
      this.options.borderThickness,
      this.options.borderColor,
      this.options.borderAlpha
    )
    this.graphics.strokeRect(x, y, rectWidth, rectHeigth)
  }

  private createCloseBtn(width: number, height: number, closeBtnCallback) {
    const self = this
    this.closeBtn = this.getHUDScene().make.text({
      x: width - this.options.padding - 18,
      y: height - this.options.padding - this.options.windowHeight + 6,
      text: 'X',
      style: {
        font: 'bold 16px Arial',
        color: this.options.closeBtnColor.toString(),
      }
    })

    this.closeBtn.setInteractive()
    this.closeBtn.on('pointerover', function () {
      self.closeBtn.setColor('#ff0000')
    })
    this.closeBtn.on('pointerout', function () {
      self.closeBtn.setColor(self.options.closeBtnColor.toString())
    })
    this.closeBtn.on('pointerdown', () => {
      self.setVisible(false)

      if (this.timedEvent) this.timedEvent.remove()
      closeBtnCallback()
    })
  }

  private createCloseBtnBorder(width: number, height: number) {
    const x = width - this.options.padding - 18
    const y = height - this.options.padding - this.options.windowHeight
    this.graphics.strokeRect(x, y, 18, 18)
  }

  private createWindow(closeBtnCallback) {
    const gameHeight = this.getGameHeight()
    const gameWidth = this.getGameWidth()
    const {x, y, boxWidth, boxHeight} = this.calculateWindowDimensions(gameWidth, gameHeight)
    const activeScene = this.getHUDScene()
    if (activeScene) {
      this.graphics = activeScene.add.graphics()
  
      this.createWindowBox(x, y, boxWidth, boxHeight)
      this.createCloseBtn(gameWidth, gameHeight, closeBtnCallback)
      this.createCloseBtnBorder(gameWidth, gameHeight)
    }
  }

  private getHUDScene(hudSceneKey = 'HUDScene'): Phaser.Scene {
    const hudScene = this.game.scene.getScene(hudSceneKey)
    if (hudScene === undefined || !this.game.scene.isActive(hudSceneKey)) {
      // This can happen only if im not making things properly
      console.error('DialogueModalPlugin: Could not find HUDScene OR HUDScene is not active')
      throw new Error('DialogueModalPlugin: Could not find HUDScene OR HUDScene is not active')
    }
    return hudScene
  }

  private getGameWidth(): number {
    return this.game.scale.width
  }
  
  private getGameHeight(): number {
    return this.game.scale.height
  }

  destroy(): void {
    // TOmaybeDO: do I need to destroy all the things?
  }

  start(): void {}

  stop(): void {
    if (this.timedEvent) this.timedEvent.remove()
    if (this.currentText) this.currentText.destroy()
  }
}
