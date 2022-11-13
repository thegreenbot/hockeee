import Phaser from 'phaser';
import DebugScene from './scenes/DebugScene';
import PreloadScene from './scenes/PreloadScene';
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

const Scenes = [PreloadScene, DebugScene];

const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));

const config: Phaser.Types.Core.GameConfig = {
  width: 600,
  height: 800,
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
  scene: initScenes()
}

new Phaser.Game(config);