import BaseScene from "../BaseScene";

export default class ParallaxScene extends BaseScene {
    
    topGoalMountains: Phaser.GameObjects.Container|null = null;
    bottomGoalMountains: Phaser.GameObjects.Container|null = null;
    playTopScene: Boolean = false;
    playBottomScene: Boolean = false;
    
    constructor(config: object) {
        super('ParallaxScene', {...config, canGoBack: true});
    }

    preload() {
        this.load.image('bg1rocks_1', 'bg1/rocks_1.png');
        this.load.image('bg1rocks_2', 'bg1/rocks_2.png');
        this.load.image('bg1_sky', 'bg1/sky.png');
        this.load.image('bg1_clouds_1', 'bg1/clouds_1.png');
        this.load.image('bg1_clouds_2', 'bg1/clouds_2.png');
        this.load.image('bg1_clouds_3', 'bg1/clouds_3.png');
        this.load.image('bg1_clouds_4', 'bg1/clouds_4.png');

        this.load.image('bg4_sky', 'bg4/sky.png');
        this.load.image('bg4_clouds1', 'bg4/clouds_1.png');
        this.load.image('bg4_clouds2', 'bg4/clouds_2.png');
        this.load.image('bg4_ground', 'bg4/ground.png');
        this.load.image('bg4_rocks', 'bg4/rocks.png');
    }

    create() {
      super.create();
      // screen is divided into 100px -> 50% - 200px -> 50% - 200px -> 100px;

      const config = this.getConfig();
      const originX = config.width/2;
      const topBackgroundOriginY = config.height/2 - 200;
      const topBackgroundHeight = config.height/2 - 100;
      const bottomOriginY = config.height/2 + 200;
      const imageBaseHeight = 1080;
      const imageBaseWidth = 1920;
      const heightRatio = topBackgroundHeight / imageBaseHeight;
      
      // top scene
      const bg1 = this.add.image(originX, topBackgroundOriginY, 'bg1_sky').setDisplaySize(config.width, topBackgroundHeight);
      bg1.setDataEnabled();
      bg1.data.set('scrollspeed', 0);
      const cloud1 = this.add.tileSprite(originX, topBackgroundOriginY, imageBaseWidth, imageBaseHeight, 'bg1_clouds_1');
      cloud1.setScale(heightRatio);
      cloud1.setDataEnabled();
      cloud1.data.set('scrollspeed', 0.1);
      const cloud2 = this.add.tileSprite(originX, topBackgroundOriginY, imageBaseWidth, imageBaseHeight, 'bg1_clouds_2');
      cloud2.setScale(heightRatio);
      cloud2.setDataEnabled();
      cloud2.data.set('scrollspeed', 0.12);
      const rocks1 = this.add.tileSprite(originX, topBackgroundOriginY, imageBaseWidth, imageBaseHeight,'bg1rocks_1');
      rocks1.setScale(heightRatio);
      rocks1.setDataEnabled();
      rocks1.data.set('scrollspeed', 0.4);
      const rocks2 = this.add.tileSprite(originX, topBackgroundOriginY, imageBaseWidth, imageBaseHeight, 'bg1rocks_2');
      rocks2.setScale(heightRatio);
      rocks2.setDataEnabled();
      rocks2.data.set('scrollspeed', 0.5);
      this.topGoalMountains = this.add.container(0, 100, [bg1, cloud1, cloud2, rocks1, rocks2]).setName('topGoal');

      // bottom scene
      const bg2 = this.add.image(originX, bottomOriginY, 'bg4_sky').setDisplaySize(config.width, topBackgroundHeight);
      bg2.flipY = true;
      bg2.setDataEnabled();
      bg2.data.set('scrollspeed', 0);
      const s2cloud1 = this.add.tileSprite(originX, bottomOriginY, imageBaseWidth, imageBaseHeight, 'bg4_clouds1');
      s2cloud1.setScale(heightRatio);
      s2cloud1.flipY = true;
      s2cloud1.setDataEnabled();
      s2cloud1.data.set('scrollspeed', 0.09);
      const s2cloud2 = this.add.tileSprite(originX, bottomOriginY, imageBaseWidth, imageBaseHeight, 'bg4_clouds2');
      s2cloud2.setScale(heightRatio);
      s2cloud2.flipY = true;
      s2cloud2.setDataEnabled();
      s2cloud2.data.set('scrollspeed', 0.1);
      const s2rocks = this.add.tileSprite(originX, bottomOriginY, imageBaseWidth, imageBaseHeight, 'bg4_rocks');
      s2rocks.setScale(heightRatio);
      s2rocks.flipY = true;
      s2rocks.setDataEnabled();
      s2rocks.data.set('scrollspeed', 0.4);
      const s2ground = this.add.tileSprite(originX, bottomOriginY, imageBaseWidth, imageBaseHeight, 'bg4_ground');
      s2ground.setScale(heightRatio);
      s2ground.flipY = true;
      s2ground.setDataEnabled();
      s2ground.data.set('scrollspeed', 0.6);

      this.bottomGoalMountains = this.add.container(0, 0, [
        bg2,
        s2cloud1,
        s2cloud2,
        s2rocks,
        s2ground
      ]).setName('bottomGoal');


      const topText = this.add.text(config.width/2 - 50, 20, "Toggle Top Scene").setInteractive();
      const bottomText = this.add.text(config.width/2 - 50, config.height - 20, "Toggle Bottom Scene").setInteractive();
      
      topText.on('pointerup', function() {
        this.playTopScene = (this.playTopScene) ? false : true;
      }, this);

      bottomText.on('pointerup', function() {
        this.playBottomScene = (this.playBottomScene) ? false : true;
      }, this)

    }


    update() {
      if (this.playTopScene) {
        this.topGoalMountains?.each((item) => {
          const scrollSpeed = item.data.get('scrollspeed');
          item.tilePositionX += scrollSpeed;
        });
      } else {
        this.topGoalMountains?.each((item) => {
          item.tilePositionX = item.tilePositionX;
        })
      }

      if (this.playBottomScene) {
        this.bottomGoalMountains?.each(item => {
          const scrollSpeed = item.data.get('scrollspeed');
          item.tilePositionX -= scrollSpeed;
        }) 
      } else {
        this.bottomGoalMountains?.each(item => {
          item.tilePositionX = item.tilePositionX;
        })
      }
    }

}