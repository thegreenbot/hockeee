import Phaser from "phaser";
import CollisionDebugScene from "./scenes/debug/CollisionDebugScene";
import TypesDebugScene from "./scenes/debug/TypesDebugScene";
import PreloadScene from "./scenes/PreloadScene";
import PlayScene from "./scenes/PlayScene";
import { mobileAndTabletCheck } from "./utils/utils";
import ScoreDebugScene from "./scenes/debug/ScoreDebugScene";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import BallAnimationScene from "./scenes/debug/BallAnimationScene";
import BallDamageScene from "./scenes/debug/BallDamageScene";
import MenuScene from "./scenes/MenuScene";
import DebugMenuScene from "./scenes/DebugMenuScene";
import PauseScene from "./scenes/PauseScene";
import SlingScene from "./scenes/debug/SlingScene";
import ParallaxScene from "./scenes/debug/ParallaxScene";

const scale = mobileAndTabletCheck()
  ? {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
  : { autoCenter: Phaser.Scale.CENTER_BOTH };

const SHARED_CONFIG = {
  width: window ? window.innerWidth - 20 : 600,
  height: window ? window.innerHeight - 20 : 800,
  maxVelocity: 50,
};

const Scenes = [
  PreloadScene,
  MenuScene,
  DebugMenuScene,
  PauseScene,
  CollisionDebugScene,
  TypesDebugScene,
  ScoreDebugScene,
  BallAnimationScene,
  BallDamageScene,
  ParallaxScene,
  SlingScene,
  PlayScene,
];

const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));

const pluginConfig = {
  plugin: PhaserMatterCollisionPlugin,
  key: "matterCollision" as "matterCollision",
  mapping: "matterCollision" as "matterCollision",
};

declare module "phaser" {
  interface Scene {
    [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
  }

  namespace Scenes {
    interface Systems {
      [pluginConfig.key]: PhaserMatterCollisionPlugin;
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  ...SHARED_CONFIG,
  parent: "game",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: SHARED_CONFIG.width,
    height: SHARED_CONFIG.height
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: false,
      enableSleeping: true,
    },
    arcade: {
      debug: false,
      gravity: {
        x: 0,
        y: 0,
      },
    },
  },
  plugins: { scene: [pluginConfig] },
  scene: initScenes(),
};

new Phaser.Game(config);
