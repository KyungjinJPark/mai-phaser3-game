import * as Phaser from 'phaser'

import { BootScene } from './scenes/BootScene'
import { WorldScene } from './scenes/WorldScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'TS Game',

  scale: {
    width: 16 * 20,
    height: 16 * 16,
  },
  zoom: 3, // enlarges the game scale
  pixelArt: true,

  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    },
  },

  scene: [BootScene, WorldScene],

  parent: 'game',
  backgroundColor: '#000000'
}

export const game = new Phaser.Game(gameConfig)