import * as Phaser from 'phaser'

import { BootScene } from './scenes/BootScene'
import { TestScene } from './scenes/TestScene'
import { WorldScene } from './scenes/WorldScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'TS Game',

  scale: {
    // width: 16 * 3 * 18,
    // height: 16 * 3 * 12,
    width: 650,
    height: 750,
  },
  // zoom: 2, // enlarges the game scale
  pixelArt: true,

  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    },
  },

  scene: [BootScene, WorldScene, TestScene],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)