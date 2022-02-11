import * as Phaser from 'phaser'

import { BootScene } from './scenes/BootScene'
import { TestScene } from './scenes/TestScene'
import { WorldScene } from './scenes/WorldScene'

import { DialogueModalPlugin } from './plugins/DialogueModal'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Phas3r RPG',

  scale: {
    // width: 16 * 3 * 18,
    // height: 16 * 3 * 12,
    width: 750,
    height: 700,
  },
  // zoom: 2, // enlarges the game scale
  pixelArt: true,

  plugins: {
    global: [
      { key: 'DialogueModalPlugin', plugin: DialogueModalPlugin, start: true },
    ],
  },

  scene: [BootScene, WorldScene, TestScene],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)