import BaseScene from "../BaseScene";

export default class ScoreDebugScene extends BaseScene {
  public scoreCounter: number;

  public scoreText: any;
  
  constructor(config: object) {
    super("ScoreDebugScene", config);
    this.scoreCounter = 0;
  }

  setScoreCounter(newScore: number) {
    this.scoreCounter = newScore;
  }

  getScoreCounter() {
    return this.scoreCounter;
  }

  preload(): void {
    // this.collidingCategory = this.matter.world.nextCategory();
    // this.noncollidingCategory = this.matter.world.nextCategory();
    // this.collidingGroup = this.matter.world.nextGroup();
    // this.nonCollidingGroup = this.matter.world.nextGroup(true);
  }

  create(): void {


    // create sensor
    
    const goal = this.matter.add.rectangle(10, 10, 300, 300, {isSensor: true, isStatic: true, render: {strokeStyle: 'red', fillStyle: 'blue', lineWidth: 1}})


    // create pucks
    let i;
    let last = 30;
    let circles = [];
    let rectangles = []
    for (i =0; i <= 4; i++) {
        const circle = this.matter.add.circle(last + 400, 500, 15, {restitution: 1 });
        circles.push(circle);
        const rect = this.matter.add.rectangle(last, 500, 30, 30, {restitution: 1});
        rectangles.push(rect);
        last = last + 30;
    }

    this.matterCollision.addOnCollideStart({
        objectA: goal,
        objectB: circles,
        callback: eventData => {
            const currentScore = this.getScoreCounter();
            this.setScoreCounter(currentScore + 1);
            this.scoreText.setText(`Circles in Goal: ${this.getScoreCounter()}`);
        }
    });

    this.matterCollision.addOnCollideEnd({
        objectA: goal,
        objectB: circles,
        callback: eventData => {
            const currentScore = this.getScoreCounter();
            this.setScoreCounter(currentScore - 1);
            this.scoreText.setText(`Circles in Goal: ${this.getScoreCounter()}`);
        }
    });

    this.scoreText = this.add.text(300, 50, `Circles in Goal: ${this.getScoreCounter()}`);

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  update(time: number, delta: number): void {}
}
