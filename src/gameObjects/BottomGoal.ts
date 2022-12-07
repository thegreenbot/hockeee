export default class BottomGoal {
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
      const originY = height / 2 + (height/2 - 100)/2;
      const backgroundHeight = height / 2 - 100;
      const baseHeight = 1080;
      const baseWidth = 1920;
      const ratio = backgroundHeight / baseHeight;
  
      const bg = this.scene.add.image(originX, originY, "bg4_sky")
      .setDataEnabled();
      bg.data.set('scrollspeed', 0);
  
      const cloud1 = this.scene.add
        .tileSprite(originX, originY, baseWidth, baseHeight, "bg4_clouds1")
        .setDataEnabled()
        .setScale(ratio);
      cloud1.data.set("scrollspeed", 0.1);
  
      const cloud2 = this.scene.add
        .tileSprite(originX, originY, baseWidth, baseHeight, "bg4_clouds2")
        .setDataEnabled()
        .setScale(ratio);
      cloud2.data.set("scrollspeed", 0.12);
  
      const rocks1 = this.scene.add
        .tileSprite(originX, originY, baseWidth, baseHeight, "bg4_rocks")
        .setDataEnabled()
        .setScale(ratio);
      rocks1.data.set("scrollspeed", 0.4);
  
      const ground = this.scene.add.tileSprite(originX, originY, baseWidth, baseHeight, 'bg4_ground')
        .setScale(ratio)
        .setDataEnabled();
        ground.data.set('scrollspeed', 0.5);
      
        this.goal = this.scene.add.container(0, 0, [bg, cloud1, cloud2, rocks1, ground]).setName("bottomgoal");
      this.goal.each(item => {
          item.setPipeline('Light2D');
          item.setDisplaySize(width, backgroundHeight);
          item.flipY = true;
      });

  
      this.sensor = this.scene.matter.add.rectangle(width/2, originY, width, backgroundHeight, {isSensor: true, isStatic: true, label: "bottomgoal"});
      
    
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
  