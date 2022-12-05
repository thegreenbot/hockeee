import Phaser from "phaser";
import Ball from "../gameObjects/Ball";
import Player from "../gameObjects/Player";
import { createCollisionEvents } from "../utils/collisionEvents";
import BaseScene from "./BaseScene";

export default class PlayScene extends BaseScene {
  public sling: MatterJS.ConstraintType | null = null;
  public topBar: any;
  public bottomBar: any;
  public topGoal: Phaser.Physics.Matter.Image | null = null;
  public bottomGoal: Phaser.Physics.Matter.Image | null = null;
  public turnStarted: boolean = false;
  public isPaused: boolean = false;
  private players: Array<Player> = [];
  public ammo: Array<Ball> = [];
  public currentPlayer: number = 0;
  public activeTween: Phaser.Tweens.Tween | null = null;

  constructor(config: object) {
    super("PlayScene", config);
  }

  createPause() {
    this.isPaused = true;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setOrigin(1)
      .setScale(3)
      .setInteractive();

    pauseButton.on("pointerdown", () => {
      console.log("pause");
      this.matter.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  arrangeAmmo() {
    this.players.map( (player, index) => {
      let {x,y} = player.getStartVector();
      const ammo = player.getAllAmmo();
      ammo.map( item => {
        item.setX(x);
        item.setY(y);
        if (index === 0 || index === 3) {
          x = x + 30;
        } else {
          x = x - 30;
        }
      })
    });
  }

  createAmmo(ammoCount: number = 2) {
    const particlesManager = this.add.particles("flares");

    this.players.map((player, index) => {
      let { x, y } = player.getStartVector();
      for (let i = 0; i < ammoCount; i++) {
        const ball = new Ball(
          this,
          x,
          y,
          player.getSpriteFrame(),
          particlesManager,
          player.getEmittercolor(),
          player.getName()
        );
        ball.setScale(0.5);
        ball.setStatic(true);

        ball.setCollisionGroup(this.nonCollidingGroup);
        player.addAmmo(ball);
        this.ammo.push(ball);
        
      }
    });
    this.arrangeAmmo();
  }

  createAnimations() {
    const animConf = [
      { key: "player1", start: 0, end: 11 },
      { key: "player2", start: 12, end: 23 },
      { key: "player3", start: 24, end: 35 },
      { key: "player4", start: 36, end: 47 },
    ];
    animConf.forEach((anim) => {
      this.createAnim(anim.key, anim.start, anim.end);
    });
  }

  calculateScore() {
    // should look at zones & balls
    // match score to player
  }

  createPlayers() {
    for (let i = 0; i < 4; i++) {
      const config = this.getConfig();
      const text = this.add.text(0, 0, `player${i + 1}: 0`);
      const player = new Player(config, `player${i + 1}`, i);
      player.setTextObject(text);
      this.players.push(player);
    }
  }

  setCurrentPlayer() {
    this.currentPlayer < 3 ? this.currentPlayer++ : (this.currentPlayer = 0);
  }

  canPlay() {
    let canplay = false;
    this.players.map((player) => {
      if (canplay) {
        return;
      } else {
        canplay = player.hasAmmo();
      }
    });
    return canplay;
  }

  startTurn(player?: number) {
    if (this.canPlay()) {
      if (player || player === 0) {
        this.currentPlayer = player;
      } else {
        this.setCurrentPlayer();
      }
      this.createSling();
    } else {
      // game over!
      console.log('game over');
    }
  }

  createSling() {
    const config = this.getConfig();
    const posX = config.width / 2;
    const posY =
      this.currentPlayer === 0 || this.currentPlayer === 2
        ? config?.height - 70
        : 70;
    const startRect = this.matter.add.rectangle(posX, posY, 5, 5, {
      isStatic: true,
      collisionFilter: { group: this.nonCollidingGroup },
    });
    const ball = this.players[this.currentPlayer].getAmmo();
    ball?.setX(posX);
    ball?.setY(posY);
    ball?.setScale(1);
    ball?.setDepth(1);
    ball?.setInteractive();
    ball?.setStatic(false);
    this.input.setDraggable(ball);
    this.sling = this.matter.add.constraint(startRect, ball?.body, 0, 0.1);
    this.activeTween = this.tweens.add({
      targets: ball,
      scale: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 1000,
      delay: 100,
    });
  }

  createCollisionGroups() {
    this.nonCollidingGroup = this.matter.world.nextGroup(true);
    this.collidingGroup = this.matter.world.nextGroup();
    this.collidingCategory = this.matter.world.nextCategory();
  }

  createInputs() {
    this.input.on("dragend", (pointer, ball) => {
      this.turnStarted = true;
      setTimeout(() => {
        this.input.setDraggable(ball.body.gameObject, false);
        this.sling.bodyB = null;
        this.matter.world.remove(this.sling.bodyA);
        ball.setCollisionGroup(this.collidingGroup);
        ball.body.gameObject.disableInteractive();
        ball.body.ignorePointer = true;
        this.matter.world.remove(this.sling);
        this.tweens.remove(this.activeTween);
      }, 20);
    });
  }

  createGameGrid() {
    const config = this.getConfig();

    this.topGoal = this.matter.add.image(
      config.width / 2,
      config.height / 2 - 150,
      "bg1",
      undefined,
      {
        isSensor: true,
        isStatic: true,
        label: "topgoal",
      }
    );
    this.topGoal.flipY = true;
    this.topGoal.displayHeight = config.height / 2 - 100;
    this.topGoal.setDepth(0);

    // background 2
    this.bottomGoal = this.matter.add.image(
      config.width / 2,
      config.height / 2 + 150,
      "bg3",
      undefined,
      {
        isSensor: true,
        isStatic: true,
        label: "bottomgoal",
      }
    );
    this.bottomGoal.displayHeight = config.height / 2 - 100;
    this.bottomGoal.displayWidth = config.width;
    this.bottomGoal.flipY = true;

    // Player text
    const p1t = this.players[0].getTextObject();
    p1t.setX(5);
    p1t.setY(config.height - 80);
    const p2t = this.players[1].getTextObject();
    p2t.setX(config.width - 5);
    p2t.setY(80);
    p2t.rotation = Math.PI;
    const p3t = this.players[2].getTextObject();
    p3t.setOrigin(1, 0);
    p3t.setX(config.width - 5);
    p3t.setY(config.height - 80);
    const p4t = this.players[3].getTextObject();
    p4t?.setOrigin(1, 0);
    p4t.setX(5);
    p4t.setY(80);
    p4t.rotation = Math.PI;
  }

  checkIfBallsHaveStopped(): boolean {
    let stopped = true;
    this.ammo.map((ball) => {
      if (!stopped) {
        return;
      }
      if (ball.body.speed != 0) {
        stopped = false;
      }
    });
    return stopped;
  }

  create(): void {
    this.createCollisionGroups();
    this.createPlayers();
    this.createGameGrid();
    this.createPause();
    this.createAnimations();
    this.createAmmo(5);
    this.createInputs();
    createCollisionEvents([this.topGoal, this.bottomGoal], this.ammo, this);
    this.startTurn(0);

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  cleanup(): void {
    const config = this.getConfig();

    this.ammo.forEach((body) => {
      if (body.gameObject) {
        // if body in top area
        if (body.gameObject.y < 80) {
          // is in p4 quadrant?
          if (body.gameObject.x < config.width / 2) {
            body.gameObject.setData("belongsTo", "player4");
            this.players[3].addAmmo(body);
            body.setCollisionGroup(this.nonCollidingGroup);
            body.setScale(0.8);
            body.setStatic(true);
          }

          // is in p2 quadrant?
          if (body.gameObject.x > config.width / 2) {
            body.gameObject.setData("belongsTo", "player2");
            this.players[1].addAmmo(body);
            body.setCollisionGroup(this.nonCollidingGroup);
            body.setScale(0.8);
            body.setStatic(true);
          }
        }

        // if body in bottom area
        if (body.gameObject.y > config.height - 80) {
          // is in p3 quadrant
          if (body.gameObject.x > config.width / 2) {
            body.gameObject.setData("belongsTo", "player3");
            this.players[2].addAmmo(body);
            body.setCollisionGroup(this.nonCollidingGroup);
            body.setScale(0.8);
            body.setStatic(true);
          }
          // is in p1 quadrant
          if (body.gameObject.x < config.width / 2) {
            body.gameObject.setData("belongsTo", "player1");
            this.players[0].addAmmo(body);
            body.setCollisionGroup(this.nonCollidingGroup);
            body.setScale(0.8);
            body.setStatic(true);
          }
        }
      }
    });
  }

  update(time: number, delta: number): void {
    this.ammo.forEach((ball: Ball) => {
      ball.updateAnimation();
    });

    if (this.turnStarted) {
      // fire off method to check speed of matter bodies.
      if (this.checkIfBallsHaveStopped()) {
        this.turnStarted = false;
        this.cleanup();
        this.startTurn();
      }
    }

    this.players.map((player, index) => {
      const text = player.getTextObject();
      const score = player.getScore();
      text?.setText(`Player${index + 1}: ${score}`);
    });
  }
}
