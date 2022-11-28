import BaseScene from "../BaseScene";

export default class ScoreDebugScene extends BaseScene {
  public circleScoreCounter: number = 0;
  public squareScoreCounter: number = 0;

  public circleScoreText: any;
  public squareScoreText: any;

  constructor(config: object) {
    super("ScoreDebugScene", config);
  }

  setCircleScoreCounter(newScore: number) {
    this.circleScoreCounter = newScore;
  }

  getCircleScoreCounter() {
    return this.circleScoreCounter;
  }

  setSquareScoreCounter(newScore: number) {
    this.squareScoreCounter = newScore;
  }

  getSquareScoreCounter() {
    return this.squareScoreCounter;
  }

  preload(): void {}

  create(): void {
    const { width, height } = this.getConfig();

    // create sensor

    const circlegoal = this.matter.add.rectangle(
      width / 4,
      150,
      width / 2,
      300,
      { isSensor: true, isStatic: true, label: "circlegoal" }
    );
    const squareGoal = this.matter.add.rectangle(
      (width / 4) * 3,
      150,
      width / 2,
      300,
      { isSensor: true, isStatic: true, label: "squaregoal" }
    );

    // create pucks
    let i;
    let last = 30;
    let items = [];
    for (i = 0; i <= 4; i++) {
      const circle = this.matter.add.circle(last + 400, 500, 15, {
        restitution: 1,
      });
      items.push(circle);
      const rect = this.matter.add.rectangle(last, 500, 30, 30, {
        restitution: 1,
      });
      items.push(rect);
      last = last + 30;
    }

    this.matterCollision.addOnCollideStart({
      objectA: [circlegoal, squareGoal],
      objectB: items,
      callback: (eventData) => {
        const { bodyA, bodyB } = eventData;
        if (bodyA.label === "circlegoal" && bodyB.label === "Circle Body") {
          const currentCircleScore = this.getCircleScoreCounter();
          this.setCircleScoreCounter(currentCircleScore + 1);
          this.circleScoreText.setText(
            `Circles in Goal: ${this.getCircleScoreCounter()}`
          );
        } else if (
          bodyA.label === "squaregoal" &&
          bodyB.label === "Rectangle Body"
        ) {
          const currentSquareScore = this.getSquareScoreCounter();
          this.setSquareScoreCounter(currentSquareScore + 1);
          this.squareScoreText.setText(
            `Squares in Goal: ${this.getSquareScoreCounter()}`
          );
        }
      },
    });

    this.circleScoreText = this.add.text(
      20,
      50,
      `Circles in Goal: ${this.getCircleScoreCounter()}`
    );
    this.squareScoreText = this.add.text(
      width / 2 + 20,
      50,
      `Squares in Goal: ${this.getSquareScoreCounter()}`
    );

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  update(time: number, delta: number): void {}
}
