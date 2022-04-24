type optionalParameters = {
  borderThickness?: number,
  borderColor?: number,
  borderAlpha?: number,
  windowAlpha?: number,
  windowColor?: number,
  windowHeight?: number,
  padding?: number,
  dialogSpeed?: number,
}

export class DialogueModalPlugin extends Phaser.Plugins.BasePlugin {
  private HUD_SCENE: Phaser.Scene
  private options: optionalParameters = {
    borderThickness: 3,
    borderColor: 0x907748,
    borderAlpha: 1,
    windowAlpha: 0.8,
    windowColor: 0x303030,
    windowHeight: 200,
    padding: 16,
    dialogSpeed: 3
  }
  private graphics: Phaser.GameObjects.Graphics
  private visible: boolean
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private timedEvent: Phaser.Time.TimerEvent
  private dialogueStepDelay: number = 30
  private displayText
  private fullText: string[]
  private eventCounter

  public constructor(pluginManager) {
    super(pluginManager)
  } 

  public init(opts: optionalParameters): void { // optional parameters
    if (!opts) {
      for (const param in opts) {
        this.options[param] = opts[param]
      }
    }
  }
  public start(): void {}
  public destroy(): void {} // TOmaybeDO: do I need to destroy all the things?
  public stop(): void {
    if (this.timedEvent) this.timedEvent.remove()
    if (this.displayText) this.displayText.destroy() // TODO: more to destroy
  }

  public assignHUDScene(hudScene): void {
    this.HUD_SCENE = hudScene

    // set up key captures
    if (this.cursors === undefined) {
      this.cursors = this.HUD_SCENE.input.keyboard.createCursorKeys()
    }

    // set up dialogue box graphics
    this.setUpDialogueBox()

    // set up `currentText`
    const x = this.options.padding + 10
    const y = this.GAME_HEIGHT - this.options.windowHeight - this.options.padding + 10
    this.displayText = this.HUD_SCENE.make.text({
      x, y,
      text:'',
      style: {
        wordWrap: { width: this.GAME_WIDTH - (2 * this.options.padding) - 25},
        fontSize: '18px',
        color: '#ffffff'
      }
    }).setDepth(10)

    this.setVisible(false)
  }

  public async startDialogue(dialogue: string[], animate = true): Promise<void> {
    // remove dialogue exit if it exists
    this.cursors.space.removeListener('down')

    this.setVisible(true)
    for (let i = 0; i < dialogue.length; i++) {
      await this.setDialogueText(dialogue[i], animate)
    }

    // Once dialogue is finished, set up exit dialogue callback for promise
    return new Promise<void>(resolve => {
      this.cursors.space.removeListener('down')
      this.cursors.space.on('down', () => {
        this.setVisible(false)

        if (this.timedEvent) this.timedEvent.remove()
        resolve()
      })
    })
  }
  
  private get GAME_WIDTH(): number {
    return this.game.scale.width
  }
  private get GAME_HEIGHT(): number {
    return this.game.scale.height
  }

  private setVisible(visibility: boolean) {
    this.visible = visibility
    
    this.graphics.setVisible(visibility)
    this.displayText.setVisible(visibility)
  }

  private setDialogueText(text: string, animate: boolean): Promise<void> {
    return new Promise<void>(resolve => {
      if (animate) {
        this.eventCounter = 0
        this.displayText.setText('')
        this.fullText = Array.from(text)
        
        if (this.timedEvent) this.timedEvent.destroy()
        Phaser.Time.TimerEvent
        this.timedEvent = this.HUD_SCENE.time.addEvent({
          delay: this.dialogueStepDelay,
          callback: this.animateNextTextStep(resolve),
          callbackScope: this,
          loop: true
        })
      } else { 
        this.displayText.setText(text)
        resolve()
      }
    })
  }

  private animateNextTextStep(resolvePromise) {
    return () => {
      this.displayText.setText(this.displayText.text + this.fullText[this.eventCounter])
      this.eventCounter++
      if (this.eventCounter >= this.fullText.length) {
        this.timedEvent.remove()
        resolvePromise()
      }
    }
  }

  private setUpDialogueBox(): void {
    this.graphics = this.HUD_SCENE.add.graphics()
    const {x, y, boxWidth, boxHeight} = this.calculateWindowDimensions()
    this.createWindowBox(x, y, boxWidth, boxHeight)
  }

  private calculateWindowDimensions() {
    const x = this.options.padding
    const y = this.GAME_HEIGHT - this.options.windowHeight - this.options.padding
    const boxWidth = this.GAME_WIDTH - (2* this.options.padding)
    const boxHeight = this.options.windowHeight
    return { x, y, boxWidth, boxHeight }
  }
  
  private createWindowBox(x, y, boxWidth, boxHeight) {
    this.graphics.fillStyle(this.options.windowColor, this.options.windowAlpha)
    this.graphics.fillRect(x, y, boxWidth, boxHeight)
    this.graphics.lineStyle(
      this.options.borderThickness,
      this.options.borderColor,
      this.options.borderAlpha
    )
    this.graphics.strokeRect(x, y, boxWidth, boxHeight)
  }
}
