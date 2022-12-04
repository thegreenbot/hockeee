import Ball from "../../gameObjects/Ball";
import BaseScene from "../BaseScene";

export default class BallAnimationScene extends BaseScene {
  constructor(config: object) {
    super("BallAnimationScene", {...config, canGoBack: true});
  }

  createAnims() {
    const animConf = [
      { key: "poke1", start: 0, end: 11 },
      { key: "poke2", start: 12, end: 23 },
      { key: "poke3", start: 24, end: 35 },
      { key: "poke4", start: 36, end: 47 },
    ];
    animConf.forEach((anim) => {
      this.createAnim(anim.key, anim.start, anim.end);
    });
  }

  preload() {}

  create() {
    super.create();
    this.createAnims();
    const { height, width } = this.getConfig();

    var particles = this.add.particles("flares");

    // create 1 of each type of Poke ball
    const matterBodyConfig: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      restitution: 1,
      circleRadius: 26,
      density: 10,
      frictionAir: 0.03,
    };
    const poke1 = this.matter.add.sprite(
      width / 2 - 100,
      height / 2,
      "poke",
      0,
      { ...matterBodyConfig, label: "poke1" }
    );

    const poke2 = this.matter.add.sprite(
      width / 2 - 50,
      height / 2,
      "poke",
      12,
      { ...matterBodyConfig, label: "poke2" }
    );

    const poke3 = this.matter.add.sprite(width / 2, height / 2, "poke", 24, {
      ...matterBodyConfig,
      label: "poke3",
    });

    const poke4 = this.matter.add.sprite(
      width / 2 + 50,
      height / 2,
      "poke",
      36,
      { ...matterBodyConfig, label: "poke4" }
    );
    poke4.play({ key: "poke4", frameRate: 10 });

    // create emitter for poke1 ball
    const poke1emitter = particles.createEmitter({
      frame: "red",
      speed: { onEmit: () => poke1.body.speed * 10 },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(poke1.body.speed, 0, 300) * 40000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(poke1.body.speed, 0, 300) * 1000,
      },
      scale: { start: 1.0, end: 0 },
      blendMode: "ADD",
    });

    // create emitter for poke2 ball
    const poke2emitter = particles.createEmitter({
      frame: "blue",
      speed: { onEmit: () => poke2.body.speed * 10 },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(poke2.body.speed, 0, 300) * 40000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(poke2.body.speed, 0, 300) * 1000,
      },
      scale: { start: 1.0, end: 0 },
      blendMode: "ADD",
    });

    const poke3emitter = particles.createEmitter({
      frame: "yellow",
      speed: { onEmit: () => poke3.body.speed * 10 },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(poke3.body.speed, 0, 300) * 40000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(poke3.body.speed, 0, 300) * 1000,
      },
      scale: { start: 1.0, end: 0 },
      blendMode: "ADD",
    });

    const poke4emitter = particles.createEmitter({
      frame: "green",
      speed: { onEmit: () => poke4.body.speed * 10 },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(poke4.body.speed, 0, 300) * 40000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(poke4.body.speed, 0, 300) * 1000,
      },
      scale: { start: 1.0, end: 0 },
      blendMode: "ADD",
    });

    poke1emitter.startFollow(poke1);
    poke2emitter.startFollow(poke2);
    poke3emitter.startFollow(poke3);
    poke4emitter.startFollow(poke4);

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  update(time: number, delta: number): void {
    const allBalls = this.matter.getMatterBodies();

    allBalls.forEach((ball) => {
      const labels = ["poke1", "poke2", "poke3", "poke4"];
      labels.forEach((label) => {
        if (ball.label == label) {
          if (ball.speed <= 0.1) {
            ball.gameObject.anims.stop();
          } else {
            const speed =
              Math.min(
                1,
                Math.max(Math.abs(ball.velocity.x), Math.abs(ball.velocity.y)) /
                  200
              ) * 10;
            ball.gameObject.anims.play(label, speed);
          }
        }
      });
    });
  }
}
