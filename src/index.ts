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
  width: window.innerWidth - 40,
  height: window.innerHeight - 40,
  maxVelocity: 50,
}

const Scenes = [PreloadScene, DebugScene];

const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));

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
  scene: initScenes()
}

new Phaser.Game(config);