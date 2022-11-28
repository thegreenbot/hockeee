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

    // create sensors
    const circlegoal = this.matter.add
      .image(width/2, height/2 - 150, "bg1", undefined, {
        isSensor: true,
        isStatic: true,
        label: "circlegoal",
      });
    circlegoal.displayHeight = height / 2 - 100;
    circlegoal.displayWidth = width;
    circlegoal.setDepth(0);

    const squareGoal = this.matter.add
      .image(width/2, height/2 + 150, "bg3", undefined, {
        isSensor: true,
        isStatic: true,
        label: "squaregoal",
      });
    squareGoal.displayHeight = height / 2 - 100;
    squareGoal.displayWidth = width;
    squareGoal.setDepth(0);

    // create pucks
    let i;
    let last = 250;
    let items = [];
    for (i = 0; i <= 4; i++) {
      const circle = this.matter.add.circle(last, height - 75, 15, {
        restitution: 1,
      });
      items.push(circle);
      const rect = this.matter.add.rectangle(last, 75, 30, 30, {
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

    this.matterCollision.addOnCollideEnd({
      objectA: [circlegoal, squareGoal],
      objectB: items,
      callback: (eventData) => {
        const { bodyA, bodyB } = eventData;
        // do nothing if the item is simply still
        if (bodyB.speed !== 0) {
          if (bodyA.label === "squaregoal" && bodyB.label === "Rectangle Body") {
            const currentSquareScore = this.getSquareScoreCounter();
            this.setSquareScoreCounter(currentSquareScore - 1);
            this.squareScoreText.setText(
              `Squares in Goal: ${this.getSquareScoreCounter()}`
            )
          } else if (bodyA.label === "circlegoal" && bodyB.label === "Circle Body") {
            const currentCircleScore = this.getCircleScoreCounter();
            this.setCircleScoreCounter(currentCircleScore - 1);
            this.circleScoreText.setText(
              `Circles in Goal: ${this.getCircleScoreCounter()}`
            )
          }
        }
      }
    });

    this.circleScoreText = this.add.text(
      200,
      20,
      `Circles in Goal: ${this.getCircleScoreCounter()}`
    );
    this.squareScoreText = this.add.text(
      200,
      height - 20,
      `Squares in Goal: ${this.getSquareScoreCounter()}`
    );

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
  }

  update(time: number, delta: number): void {}
}
