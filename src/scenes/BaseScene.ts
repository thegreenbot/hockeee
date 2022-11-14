import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  private config: object;

  private playConfig: object;
  public collidingGroup: number;
  public nonCollidingGroup: number;
  public collidingCategory: number;

  constructor(key: string, config: object) {
    super(key);
    this.config = config;
    this.collidingGroup= 0;
    this.nonCollidingGroup= 0;
    this.collidingCategory=0;

    this.playConfig = {
      currentPlayer: 'player1',
      currentSling: null,
      numPlayers: 4,
      players: {
        player1: {
          name: 'player1',
          score: 0,
          ammo: [],
          spriteFrame: 0,
          start: {
            x: 20,
            y: config.height - 30
          }
        },
        player2: {
          name: 'player2',
          score: 0,
          ammo: [],
          spriteFrame: 12,
          start: {
            x: config.width - 20,
            y: 30
          }
        },
        player3: {
          name: 'player3',
          score: 0,
          ammo: [],
          spriteFrame: 24,
          start: {
            x: config.width - 20,
            y: config.height - 30
          }
        },
        player4: {
          name: 'player4',
          score: 0,
          ammo: [],
          spriteFrame: 36,
          start: {
            x: 20,
            y: 30
          }
        }
      }
    };
  }

  getConfig() {
    return this.config;
  }

  getPlayConfig() {
    return this.playConfig;
  }

  setPlayConfig(config: object) {
    this.playConfig = config;
  }

  createBall(x: number, y: number, frame: number, player: string, index: number): Phaser.Physics.Matter.Sprite {
    const matterBodyConfig: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      restitution: 0.8,
      circleRadius: 26,
      density: 10,
    }
    const ball = this.matter.add.sprite(x, y, 'poke', frame, matterBodyConfig);
    ball.setAlpha(0.5);
    ball.setScale(0.5);
    ball.disableInteractive();
    ball.name = `${player}Ball-${index}`;
    return ball;
  };
  
  createAnim(key: string, start: number, end: number) {
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNumbers('poke', {
        start: start,
        end: end
      },
      ),
      frameRate: 10,
      repeat: -1
    });
  };
  preload(): void { }
  create(): void { }
  update(time: number, delta: number): void { }

}

export default BaseScene;