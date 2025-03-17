import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Matter.Sprite {
  public animationName: string;
  public spotLight: Phaser.GameObjects.Light|null = null;

  constructor(
    scene: { matter: { world: Phaser.Physics.Matter.World } },
    x: number,
    y: number,
    frame: number,
    particlesManager: Phaser.GameObjects.Particles.ParticleEmitterManager,
    emitterColor: string,
    player: string
  ) {
    const matterBodyConfig: Phaser.Types.Matter.MatterBodyConfig = {
      restitution: 0.8,
      circleRadius: 20,
      density: 8,
      frictionAir: 0.05,
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

  public spotlightColor() {
    let color = '0xffffff';
    switch(this.animationName) {
      case 'player1':
        color = '0xE22016'
        break;
      case 'player2':
        color = '0xE6DF0C'
        break;
      case 'player3':
        color = '0xE60CE6';
        break;
      case 'player4':
        color = '0x0C2EE6';
        break;
    }
    return color;
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

  public addSpotlight() {
    const {x, y }= this.body.position;
    this.spotLight = this.scene.lights.addLight(x, y, 70, this.spotlightColor(), 4);
  }

  public destroySpotlight() {
    if (this.spotLight) {
      this.scene.lights.removeLight(this.spotLight);
      this.spotLight = null;
    }
  }

  public setSpotlightPosition() {
    if (this.spotLight) {
      const {x, y}= this.body.position;
      this.spotLight.x = x;
      this.spotLight.y = y;
    }
  }

  public reduceHealth(timestamp: number) {
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

  public setAnimationName(newName: string): void {
    this.animationName = newName;
  }
}
