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
  // animation
  private timedEvent: Phaser.Time.TimerEvent
  private dialogueStepDelay: number = 30
  private displayText
  private fullText: string
  private eventCounter
  private finished: boolean
  private finishedCallback

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
    this.cursors.space.on('down', () => {
      this.onSpace();
    })

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

  public async startDialogue(dialogue: string[], animate = true) {
    this.setVisible(true)
    for (let i = 0; i < dialogue.length; i++) {
      await this.startDialogueSlide(dialogue[i], animate)
    }

    this.setVisible(false)
    if (this.timedEvent) this.timedEvent.remove()
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

  private startDialogueSlide(text: string, animate: boolean): Promise<void> {
    return new Promise<void>(resolveSlide => {
      // set this dialogue text's resolve callback
      this.finished = false
      this.finishedCallback = resolveSlide

      if (animate) {
        this.eventCounter = 0
        this.displayText.setText('')
        this.fullText = text
        
        if (this.timedEvent) this.timedEvent.destroy()
        Phaser.Time.TimerEvent
        this.timedEvent = this.HUD_SCENE.time.addEvent({
          delay: this.dialogueStepDelay,
          callback: this.animateNextTextStep,
          callbackScope: this,
          loop: true
        })
      } else { 
        this.displayText.setText(text)
        this.enableNextSlideAbility()
      }
    })
  }

  private animateNextTextStep() {
    this.displayText.setText(this.displayText.text + this.fullText.at(this.eventCounter))
    this.eventCounter++
    if (this.eventCounter >= this.fullText.length) {
      this.timedEvent.remove()
      this.enableNextSlideAbility()
    }
  }

  private skipAnimation() {
    this.timedEvent.remove()
    this.displayText.setText(this.fullText)
    this.enableNextSlideAbility()
  }

  private enableNextSlideAbility() {
    this.finished = true
  }

  private onSpace() {
    if (this.visible) {
      if (!this.finished) {
        this.skipAnimation()
      } else {
        this.finishedCallback()
      }
    }
  }

  // ======================= box construction =======================
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
