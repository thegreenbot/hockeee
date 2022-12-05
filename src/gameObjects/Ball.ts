import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Matter.Sprite {
  public animationName: string;

  constructor(
    scene: { matter: { world: Phaser.Physics.Matter.World } },
    x: number,
    y: number,
    frame: number,
    particlesManager: Phaser.GameObjects.Particles.ParticleEmitterManager,
    emitterColor: string,
    player: string
  ) {
    const matterBodyConfig: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      restitution: 1,
      circleRadius: 25,
      density: 10,
      frictionAir: 0.02,
    };
    super(scene.matter.world, x, y, "poke", frame, matterBodyConfig);
    this.setDataEnabled();
    this.animationName = player;
    this.setData("belongsto", player);
    this.setData("health", 20);
    this.setData("ongoal", false);

    const emitter = particlesManager.createEmitter({
      frame: emitterColor,
      speed: { onEmit: () => this.body.speed * 10 },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300) * 40000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300) * 1000,
      },
      scale: { start: 1.0, end: 0 },
      blendMode: "ADD",
    });

    emitter.startFollow(this);
    scene.add.existing(this);
  }

  public updateAnimation() {
    if (this.body.speed <= 0.1) {
      this.body.gameObject.anims.stop();
    } else {
      const speed =
        Math.min(
          1,
          Math.max(
            Math.abs(this.body.velocity.x),
            Math.abs(this.body.velocity.y)
          ) / 200
        ) * 10;
      this.body.gameObject.anims.play(this.animationName, speed);
    }
  }

  public reduceHealth(timestamp) {
    console.log(`reduce health ${this.data.get('health')}`);
    if (this.data.get("health") >= 1) {
      const health = this.data.get("health");
      const density = this.body.density;
      this.data.set("lasthit", timestamp);
      this.data.set("health", health - 1);
      this.body.density = density - 1;
      this.setAdaptiveScale();
    } else {
      this.destroy();
    }
  }

  public setAdaptiveScale() {
    this.setScale(this.data.get("health") / 20);
  }
}
