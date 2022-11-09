import Phaser from 'phaser';

export default class DebugScene extends Phaser.Scene {
  public e1;
  public e2;

  public e1start: object;
  public e2start: object;

  constructor() {
    super('DebugScene');
    this.e1start = { x: 200, y: 40 }
  }

  preload() {
    this.load.spritesheet('poke', '../assets/pokeballs.png', { frameWidth: 52, frameHeight: 52, margin: 5, spacing: 4 });
  }

  fly() {
    
    this.e1.bodyB = null;
  }

  create(): void {

    this.matter.world.setBounds();

    let spb = this.matter.add.sprite(200, 40, 'poke')
      .setCircle(26)
      .setInteractive()
      .on('dragend', function(pointer, gameobject) {
        console.log('end');

      });

    this.e1 = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x: this.e1start.x, y: this.e1start.y },
      bodyB: spb.body,
      stiffness: 0.05,

    });


    this.matter.world.add(this.e1);

    this.matter.add.mouseSpring();

  }

  update() { }
}