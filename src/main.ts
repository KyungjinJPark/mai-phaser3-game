import * as Phaser from 'phaser'

import { BootScene } from './scenes/BootScene'
import { HUDScene } from './scenes/HUDScene'
import { TestScene } from './scenes/TestScene'
import { TestScene2 } from './scenes/TestScene2'

import { DialogueModalPlugin } from './plugins/DialogueModal'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Phas3r RPG',

  scale: {
    width: 750,
    height: 700,
  },
  pixelArt: true,

  plugins: {
    global: [
      { key: 'DialogueModalPlugin', plugin: DialogueModalPlugin, start: false },
    ],
  },

  scene: [ // array order determintes draw order
    BootScene,
    HUDScene, // brought to the top in its create()
    TestScene,
    TestScene2,
  ],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)