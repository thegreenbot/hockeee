import Phaser from 'phaser';
import DebugScene from './scenes/DebugScene';
import { mobileAndTabletCheck } from './utils/utils';

const scale = mobileAndTabletCheck()
 ? {
     mode: Phaser.Scale.FIT,
     autoCenter: Phaser.Scale.CENTER_BOTH,
   }
 : { autoCenter: Phaser.Scale.CENTER_BOTH }


const config: Phaser.Types.Core.GameConfig = {
  width: window.innerWidth - 60,
  height: window.innerHeight - 40,
  pixelArt: true,
  parent: 'game',
  type: Phaser.AUTO,
  scale,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: false
    }
  },
  scene: DebugScene
}

new Phaser.Game(config);