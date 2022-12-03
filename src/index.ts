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

const scale = mobileAndTabletCheck()
  ? {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    }
  : { autoCenter: Phaser.Scale.CENTER_BOTH };

const SHARED_CONFIG = {
  width: 600,
  height: 800,
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
  scale: scale,
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: false,
      enableSleeping: true,
    },
    arcade: {
      debug: true,
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
