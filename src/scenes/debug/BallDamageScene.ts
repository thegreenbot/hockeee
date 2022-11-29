import BaseScene from "../BaseScene";

export default class BallDamageScene extends BaseScene {
  
    explosionEmitter: any;

  constructor(config: object) {
    super("BallDamageScene", {...config, canGoBack: true});
  }

  preload() {
    this.load.spritesheet("healingring", "healingring.png", {
      frameWidth: 191.6,
      frameHeight: 192,
    });
    this.load.spritesheet("explosion", "explosion.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  createAnims() {
    this.anims.create({
      key: "healingring_idle",
      frames: this.anims.generateFrameNumbers("healingring", {
        start: 10,
        end: 14,
      }),
      frameRate: 12,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: "healingring_heal",
      frames: this.anims.generateFrameNumbers("healingring", {
        start: 0,
        end: 14,
      }),
      frameRate: 30,
      repeat: 0,
      yoyo: false,
    });
  }

  create() {
    super.create();
    const { height, width } = this.getConfig();
    this.createAnims();
    var particles = this.add.particles("flares");

    this.explosionEmitter = particles.createEmitter({
        frame: 'blue',
        x: 400,
        y: 300,
        speed: 100,
        blendMode: 'ADD',
        lifespan: 200,
        scale: { start: .5, end: 0 },
    });

    let balls = [],
        last = 30,
        i;
    for (i = 0; i < 2; i++) {
      const ball = this.createBall(last, height / 2, 0, "player1", i);
      ball.setDataEnabled();
      ball.data.set("health", 20);
      ball.setScale(1);
      ball.setAlpha(1);
      ball.setDepth(1);
      last = last + 200;
      balls.push(ball);
    }

    this.matterCollision.addOnCollideStart({
      objectA: balls,
      objectB: balls,
      callback: (eventData) => {
        const { gameObjectA, gameObjectB, bodyA, bodyB } = eventData;
        // decrement density
        // reduce size (scale)
        console.log(eventData);

        // race condition!
        const bodyAData = gameObjectA?.data ? gameObjectA.data.getAll() : false;
        const bodyBData = gameObjectB?.data ? gameObjectB.data.getAll() : false;

        if (bodyAData && bodyAData["lasthit"] != eventData.pair.timeCreated) {
          if (bodyAData["health"] == 1) {
            gameObjectA.destroy();
          } else {
            gameObjectA.data.set("health", bodyAData["health"] - 1);
            bodyA.density = bodyA.density - 1;
            gameObjectA.setScale(1 * (bodyAData["health"] / 20));
            gameObjectA?.data.set("lasthit", eventData.pair.timeCreated);
          }
        }

        if (bodyBData && bodyBData["lasthit"] != eventData.pair.timeCreated) {
          if (bodyBData["health"] == 1) {
            gameObjectB?.destroy();
          } else {
            gameObjectB.data.set("health", bodyBData["health"] - 1);
            bodyB.density = bodyB.density - 1;
            gameObjectB.setScale(1 * (bodyBData["health"] / 20));
            gameObjectB?.data.set("lasthit", eventData.pair.timeCreated);
          }
        }
      },
    });

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }
}
