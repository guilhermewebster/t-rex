//variaveis do jogo
let trex;
let trexImg;
let ground;
let groundImage;
let invisibleGround;
let cloud;
let cloudImage;
let cloudsGroup;
let obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
let obstaclesGroup;
let score = 0;
let nextCheckpoint = 1000;
const PLAY = 1;
const END = 0;
let gameState = PLAY;
let trexCollided;
let gameOver;
let restart;
let gameOverImg;
let restartImg;
let jumpSound;
let CheckpointSound
let dieSound

function preload(){
    //carregamento de imagens
    trexImg = loadAnimation("trex1.png","trex3.png","trex4.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    trexCollided = loadAnimation("trex_collided.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("die.mp3");
    CheckpointSound = loadSound("Checkpoint.mp3");
}

function setup(){
    createCanvas(600,200);
    trex = createSprite(50,160,20,50);
    trex.addAnimation("running",trexImg);
    trex.addAnimation("collided",trexCollided);
    trex.scale = 0.5;
    trex.x = 50;

    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    invisibleGround = createSprite(200,190,400,10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();

    obstaclesGroup = new Group();

    gameOver = createSprite(width / 2,80);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;

    restart = createSprite(width / 2,110);
    restart.addImage(restartImg);
    restart.scale = 0.5

    //trex.debug = true;
    trex.setCollider("circle",0,0,40)
}

function draw(){
    background("white");

    text("pontuaçao: " + score,500,50);

    if(gameState === PLAY){
        ground.velocityX = -4;
        score = score + Math.round(frameCount / 60);
        if(score > 0 && score % 1000 == 0){
            CheckpointSound.play();
        }
        if(ground.x < 0){
            ground.x = ground.width / 2
        }
        if(keyDown("space") && trex.y >= 100){
            trex.velocityY = -10;
            jumpSound.play();
        }
        trex.velocityY = trex.velocityY + 0.8;
        spawnClouds();
        spawnObstacles();
        if(obstaclesGroup.isTouching(trex)){
            gameState = END;
            dieSound.play();
        }
        gameOver.visible = false;
        restart.visible = false;
    }
    else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;
        ground.velocityX = 0;
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        trex.velocityY = 0;
        trex.changeAnimation("collided",trexCollided);
    }

    trex.collide(invisibleGround);

    drawSprites();
}

function spawnClouds(){
    if(frameCount % 60 === 0){
        cloud = createSprite(width + 5,height + 60,40,10);
        cloud.addImage(cloudImage);
        cloud.y = Math.round(random(10,60));
        cloud.scale = 0.4;
        cloud.velocityX = -3;
        cloud.depth = trex.depth;
        trex.depth += 1;
        cloud.lifetime = width / 3;
        cloudsGroup.add(cloud);
    }
   
}

function spawnObstacles(){
    if(frameCount  % 105 === 0){
        let obstacle = createSprite(width + 5,height - 38,10,40);
        let rand = Math.round(random(1,6));
        switch(rand){
            case 1:
                obstacle.addImage(obstacle1);
                break;
            case 2:
                obstacle.addImage(obstacle2);
                break;
            case 3:
                obstacle.addImage(obstacle3);
                break;
            case 4:
                obstacle.addImage(obstacle4);
                break;
            case 5:
                obstacle.addImage(obstacle5);
                break;
            case 6:
                obstacle.addImage(obstacle6);
                break;
            default:
                break;

        }
        obstacle.scale = 0.5;
        obstacle.velocityX = -(4 + 3 * score / 200);
        obstacle.lifetime = width / 2
        obstaclesGroup.add(obstacle);

    }

}