export default class TopGoal {
  scene: Phaser.Scene;
  config: object;
  goal: Phaser.GameObjects.Container | null = null;
  sensor: Phaser.Types.Physics.Matter.MatterBody;
  playing: boolean = false;

  constructor(scene: Phaser.Scene, config: object) {
    this.scene = scene;
    this.config = config;
    const { width, height } = this.config;
    const originX = width / 2;
    const topOriginY = height / 2 - (height / 2 - 100)/2;
    const backgroundHeight = height / 2 - 100;
    const baseHeight = 1080;
    const baseWidth = 1920;
    const ratio = backgroundHeight / baseHeight;

    const bg1 = this.scene.add.image(originX, topOriginY, "bg1_sky")
    .setDataEnabled();
    bg1.data.set('scrollspeed', 0);

    const cloud1 = this.scene.add
      .tileSprite(originX, topOriginY, baseWidth, baseHeight, "bg1_clouds_1")
      .setDataEnabled()
      .setScale(ratio);
    cloud1.data.set("scrollspeed", 0.1);

    const cloud2 = this.scene.add
      .tileSprite(originX, topOriginY, baseWidth, baseHeight, "bg1_clouds_2")
      .setDataEnabled()
      .setScale(ratio);
    cloud2.data.set("scrollspeed", 0.12);

    const rocks1 = this.scene.add
      .tileSprite(originX, topOriginY, baseWidth, baseHeight, "bg1rocks_1")
      .setDataEnabled()
      .setScale(ratio);
    rocks1.data.set("scrollspeed", 0.4);

    const rocks2 = this.scene.add.tileSprite(originX, topOriginY, baseWidth, baseHeight, 'bg1rocks_2')
      .setScale(ratio)
      .setDataEnabled();
      rocks2.data.set('scrollspeed', 0.5);
    
      this.goal = this.scene.add.container(0, 0, [bg1, cloud1, cloud2, rocks1, rocks2]).setName("topgoal");
    this.goal.each(item => {
        item.setPipeline('Light2D');
        item.setDisplaySize(width, backgroundHeight);
    });

    this.sensor = this.scene.matter.add.rectangle(width/2, topOriginY, width, backgroundHeight, {isSensor: true, isStatic: true, label: "topgoal"});
  }

  public play(): void {
    this.playing = true;
  }

  public stop(): void {
    this.playing = false;
  }
  
  public getSensor(): Phaser.Types.Physics.Matter.MatterBody {
    return this.sensor;
  }
  
}
