import Phaser from 'phaser';
import DebugScene from './scenes/DebugScene';
import PreloadScene from './scenes/PreloadScene';
import PlayScene from './scenes/PlayScene';
import { mobileAndTabletCheck } from './utils/utils';

const scale = mobileAndTabletCheck()
  ? {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
  : { autoCenter: Phaser.Scale.CENTER_BOTH }

const SHARED_CONFIG = {
  width: 600,
  height: 800,
  maxVelocity: 50,
}

const Scenes = [PreloadScene, DebugScene, PlayScene];

const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));

const config: Phaser.Types.Core.GameConfig = {
  ...SHARED_CONFIG,
  pixelArt: true,
  parent: 'game',
  type: Phaser.AUTO,
  scale: scale,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: false,
      
      enableSleeping: true
    }
  },
  scene: initScenes()
}

new Phaser.Game(config);