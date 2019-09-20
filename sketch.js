const LOADING = 0;
const MAIN_MENU = 1;
const PLAY = 2;
const HIGH_SCORE = 3;
const HELP = 4;
const VIDEO = 5;


let currentScreen;
let shipImage;
let enemy1Image;
let enemy2Image;
let titleImage;
let bulletImage;
let heartImage;
let drawMe = false; //is used to controll which sprites are being drawn per frame
let drawMeScore = false; //used to not draw dfgggg

//fonts
var myFont, fontReady = false;

//background image
let bg;

//video 
let playing = false;

let menuShip = 0;

var enemyGroup;
var bulletGroup;
var enemies = [];
var bullets = [];
var heartGroup = [];
var fireGroup = [];
var numLife;
let hit, life, shot;
let intro;
let videoWorks;
let leaderboard;
let bossImage, boss, bossHP;
let fireballImage, fireBall, firesound;
let laugh, fly2;
let bossText, bossAni;


function fontRead(){
  fontReady = true;
}
function preload(){
  //images
  titleImage = loadImage('../images/galaga30.png');
  shipImage = loadImage('../images/galagaShipGrey.png');
  enemy1Image = loadImage('../images/galagaEnemy1.png');
  enemy2Image = loadImage('../images/galagaEnemy2.png');
  bulletImage = loadImage('../images/bullet.png');
  heartImage = loadImage('../images/8bitheart.png');
  fireballImage = loadImage('../images/fireball.png');


  //font
  myFont = loadFont('../data/Emulogic-zrEw.ttf', fontRead);

  //background image
  bg = loadImage('../images/nightsky.png');

  //sound
  soundFormats('mp3');
  hit = loadSound('../assets/expo.mp3');
  life = loadSound('../assets/liv.mp3');
  shot = loadSound('../assets/skyt.mp3');
  firesound = loadSound('../assets/fire.mp3');
  laugh = loadSound('../assets/laugh.mp3');

  //videoload
  intro = createVideo('../images/galagaintro.mp4');
  intro.hide();
  
  //json
  tabell = loadJSON('leaderboard.json');

  //boss
 // bossImage = loadImage('/Galaga/images/boss.png')
   bossAni = loadAnimation("../images/BOSS00.png", "../images/BOSS_1.png");
  


}

let ship;
let title;
let enemy1;
let enemy2;
let Mainship;
let score = 0;
var bullet;
let heart;
var level = 0;

function setup() {
  createCanvas(windowWidth, windowHeight-5);
  frameRate(60);
  
  enemyGroup = new Group();
  bulletGroup = new Group();
  heartGroup = new Group();
  fireGroup = new Group();

  
  currentScreen = VIDEO;
  
  bossAni.frameDelay = 30;

}



function draw() {
  if(currentScreen == VIDEO){
    playVideo();

  }
  else if(currentScreen == LOADING){
    drawLoadingScreen();
  }
  else if(currentScreen == MAIN_MENU){
    drawMainMenu();
  }
  else if(currentScreen == PLAY){
    drawPlay();
    checkHit();
  }
  else if(currentScreen == HIGH_SCORE){
    drawHighscore();
  }
  if(frameCount == 170){
    drawMe = true;
    currentScreen = MAIN_MENU; 
  }

  drawSprites();
  
}

function playVideo(){

  if(frameCount < 160){
    image(intro, 0,0, windowWidth, windowHeight);
    intro.play();
    intro.volume(0.3);
  }
  else {
    currentScreen = LOADING;
    drawLoadingScreen;
    drawMe = true;
    intro.volume(0);
    intro.stop();
  }
  
}

function drawLoadingScreen(){

  if(drawMe){
    background(bg);
    title = createSprite(windowWidth/2,windowHeight/2);
    title.scale = 0.5;
    title.addImage(titleImage);
    

    fill(200);
    textSize(23);
    if(fontReady){
      textFont(myFont);
      text("LOADING", windowWidth/2-50, windowHeight/2+200);

    }
    

  }

  drawMe = false;
  
  
}


function drawMainMenu(){

  if(drawMe){
    background(bg);
    title.remove();
    title = createSprite(windowWidth/2,windowHeight/5);
    title.scale = 0.3;
    title.addImage(titleImage);

    var x = windowWidth/2-50;
    var y  = windowHeight/2-20;
    ship = createSprite(x,y);
    ship.scale = 0.1;
    ship.addImage(shipImage);
    ship.rotation = 90;

    mainText();

  }
  drawMe = false;
  
}

function keyPressed(){
  if(currentScreen == MAIN_MENU){
      if(keyCode === DOWN_ARROW){
        if(menuShip < 2){
          menuShip += 1;
          mainText();
        }
        
      } else if(keyCode === UP_ARROW){
        if(menuShip > 0){
          menuShip -= 1;
          mainText();
        }
      }else if(keyCode === ENTER){
      if(menuShip == 0){
        drawMeScore = false;
        drawMe = true;
        currentScreen = PLAY;
        Mainship = createSprite(windowWidth/2,windowHeight-40);
        Mainship.scale = 0.1;
        Mainship.addImage(shipImage);
        score = 0;
        level = 1;
        drawPlay();
        drawEnemies();
        numLife = 3;
        lives();
        

      }else if(menuShip == 1){
        drawMeScore = true;
        currentScreen = HIGH_SCORE;
        title.remove();
        ship.remove();
        drawHighscore();
        
      }else if(menuShip == 2){
        currentScreen = HELP;
        drawHelp();
      }
     
    }
    
  }

  //leaderboard to main
if(currentScreen == HIGH_SCORE){
    if(keyCode === ESCAPE){
      currentScreen = MAIN_MENU;
      menuShip = 0;
      drawMe = true;
      drawMainMenu();
    }
  }

if(currentScreen == HELP){
    if(keyCode === ESCAPE){
      currentScreen = MAIN_MENU;
        menuShip = 0;
        drawMe = true;
        drawMainMenu();
    }
  }
}

function keyTyped(){
  if(currentScreen == PLAY){
    if(key === ' '){
      bullet = createSprite(Mainship.position.x,Mainship.position.y);
      bullet.scale = 0.05;
      bullet.addImage(bulletImage);
      bullet.attractionPoint(10,Mainship.position.x, 0);
      shot.play();
  
      bulletGroup.add(bullet);

    }
  }
  
}

function mainText(){
  textSize(23);
  textFont(myFont); 
  fill(0);
  rect(windowWidth/2-90, windowHeight/2-50,70,300);
  fill(255);
  text("PRESS ENTER TO SELECT", windowWidth/2-200, windowHeight-40);

  if(menuShip == 0){
    y = windowHeight/2-10;
    fill(255,255,0);
    text("PLAY", windowWidth/2, windowHeight/2);
    fill(200);
    text("HIGH SCORE", windowWidth/2, windowHeight/2+100);
    text("HELP", windowWidth/2, windowHeight/2+200);


    ship.position.y = y;

  } else if(menuShip == 1){
    y = windowHeight/2+90;
    fill(255,255,0);
    text("HIGH SCORE", windowWidth/2, windowHeight/2+100);
    fill(200);
    text("PLAY", windowWidth/2, windowHeight/2);
    text("HELP", windowWidth/2, windowHeight/2+200);

    ship.position.y = y;

  }else if(menuShip == 2){
    y = windowHeight/2+190;
    fill(255,255,0);
    text("HELP", windowWidth/2, windowHeight/2+200);
    fill(200);
    text("PLAY", windowWidth/2, windowHeight/2);
    text("HIGH SCORE", windowWidth/2, windowHeight/2+100);

    ship.position.y = y;

  }
}
  

function drawPlay(){
  title.remove();
  ship.remove();

  let leftWall = 350;
  let rightWall = 1050;
  background(bg);
  
  fill(255);
  rect(leftWall, 0, 2,windowHeight);
  rect(rightWall+340,0,2, windowHeight);

  fill(200);
  rect(rightWall-5,5, 3, windowHeight);

  fill(0);
  rect(rightWall,5, 340, windowHeight);

  textSize(15);
  textFont(myFont); 
  fill(255);
  text("HIGH SCORE", rightWall+10, 40);
  text("22010", rightWall+10, 55);

  text("CURRENT SCORE", rightWall+10, 100);
  text(score, rightWall+10, 120);

  text("LEVEL", rightWall+10, 300);
  text(level, rightWall+140, 300);



  text("LIVES", rightWall+10, 400);
  


  //x and y positioning of ship
  if(Mainship.position.x >= leftWall+30){
    if(keyIsDown(LEFT_ARROW)){
      Mainship.position.x -= 10;
    }
  } 
  if(Mainship.position.x+30 <= rightWall){
    if(keyIsDown(RIGHT_ARROW)){
      Mainship.position.x += 10;
    }
  }

  checkHit();
  lives();
  if(level > 0 && level % 2 == 0){
    checkBoss();
    checkHit();
  } else{
    checkEnemies();
  }
      
}
  

function drawEnemies(){

  if(level > 0 && level % 2 == 0){
    boss = createSprite(windowWidth/2-150, windowHeight/2-200);
    boss.scale = 0.11;
    boss.addAnimation('fly', bossAni);
    boss.changeAnimation('fly');
    bossHP = 40*level;
    laugh.play();
    
    
  


  } else{
    
    for(var i = 0; i<8+(level); i++){
      if(i >= 9){
        enemy1 = createSprite(i*70-200, windowHeight/10-100);
        enemy1.scale = 0.03;
        enemy1.addImage(enemy1Image);
        enemy1.attractionPoint(1,i*70, windowHeight);

      }else {
        enemy1 = createSprite(420+i*70, windowHeight/10);
        enemy1.scale = 0.03;
        enemy1.addImage(enemy1Image);
        enemy1.attractionPoint(0.7,450+i*70, windowHeight);

      }
      
    
  
      //attraction
  
      enemyGroup.add(enemy1);
  
    }
    for(var i = 0; i<5; i++){
      enemy2 = createSprite(450+i*130, windowHeight/10+80);
      enemy2.scale = 0.135;
      enemy2.addImage(enemy2Image);
  
      //attraction bies
      enemy2.attractionPoint(level*0.7,Mainship.position.x, Mainship.position.y);
  
      enemyGroup.add(enemy2);
  
    }

  }

  
}


function checkHit(){

  for(var i = 0; i<enemyGroup.length; i++){ //for each enemy in group
    if(bulletGroup.length > 0){
      if(enemyGroup[i].overlap(bulletGroup)){
        for( var x = 0; x<bulletGroup.length; x++){
          if(bulletGroup[x].overlap(enemyGroup)){
            bulletGroup[x].remove();
          }
        }
        
        enemyGroup[i].remove();
        hit.play();
        checkEnemies();
        score += 10;
      }else if(bulletGroup[0].position.y <= 50){
        bulletGroup[0].remove();
        score -= 1;
      }
    } 
    if(enemyGroup.length <= 0){
      checkEnemies();
      level += 1; //1
      drawEnemies();
    }
 }

  for(var x = 0; x<fireGroup.length; x++){
   if(fireGroup[x].overlap(Mainship)){
     fireGroup[x].remove();
     numLife -= 1;
     life.play();
     
   }  
  }
 
}



function checkBoss(){
  fill("red");
  textSize(32);
  text("BOSS HEALTH:" + bossHP , windowWidth/2-200, 50);
  boss.attractionPoint(0.7,Mainship.position.x, boss.position.y);
  boss.position.y += 1;
  boss.friction = 0.1;
  if(bulletGroup.length > 0){
    if(boss.overlap(bulletGroup[0])){
      bossHP -= 10;
      bulletGroup[0].remove();
      hit.play();
      score += 10;
    }else if(bulletGroup[0].position.y <= 50){
      bulletGroup[0].remove();
      score -= 1;
    }
  }
  if(bossHP <= 0){
    level += 1; //2
    boss.remove();
    drawEnemies();
    score += 100;
  }
  if(boss.position.y > windowHeight-50){
    boss.remove();
    numLife -= 1;
    level += 1;
    drawEnemies();
    life.play();
  }

 
  if(frameCount % 60 == 0){
      fireBall = createSprite(boss.position.x,boss.position.y);
      fireBall.scale = 0.05;
      fireBall.rotation = -50;
      fireBall.addImage(fireballImage);
      fireBall.attractionPoint(10,Mainship.position.x, Mainship.position.y);
      firesound.play();

      fireGroup.add(fireBall);
  }

}

function checkEnemies(){
  for(var i = 0; i<enemyGroup.length; i++){ //for each enemy in group
    if(enemyGroup[i].overlap(Mainship)){
      enemyGroup[i].remove();
      numLife -= 1;
      life.play();



    } else if(enemyGroup[i].position.y > windowHeight-50){
      enemyGroup[i].remove();
      numLife -= 1;
      life.play();

      if(enemyGroup.length <= 0){
        drawEnemies();
      }
    }
  }
}

function lives(){
  if(numLife == 3){
    image(heartImage, 1060, 410, 40, 40);
    image(heartImage, 1110, 410, 40, 40);
    image(heartImage, 1160, 410, 40, 40);

  } else if(numLife == 2){
    image(heartImage, 1060, 410, 40, 40);
    image(heartImage, 1110, 410, 40, 40);


  } else if(numLife == 1){
    image(heartImage, 1060, 410, 40, 40);

  }else if(numLife <= 0){
    currentScreen = HIGH_SCORE;
    Mainship.remove();
    enemyGroup.removeSprites();
    bulletGroup.removeSprites();
    menuShip = 0;
    drawMeScore = true;

    if(level > 1){
      boss.remove();
      fireGroup.removeSprites();
    }
  }

}

function drawHighscore(){
  if(drawMeScore){
   numLife = 3;
    background(bg);
    textSize(25);
    text("LEADERBOARD", windowWidth/2-200,100);
    textSize(15);
    fill("yellow");
    text("PLAYER 1 ", windowWidth/2-200, 170)
    text("SCORE: " + score, windowWidth/2-200, 210);
    fill("red");
    text("TOP 3", windowWidth/2-200, 250);
    fill("white");
    text("PRESS 'ESC' TO RETURN TO MAIN MENU", windowWidth/3, windowHeight-20);

    for(var i = 0; i<tabell.leaderboard.length; i++){
      fill(64,224,208)
      text(tabell.leaderboard[i].name, windowWidth/2-200, i*40+300);
      text(tabell.leaderboard[i].score, windowWidth/2, i*40+300);
    }

  }
  drawMeScore = false;
  

}

function drawHelp(){
background(bg);

ship.remove();

textSize(15);
text("TURN LEFT    -   LEFT ARROW", windowWidth/2-150, windowHeight/2);
text("TURN RIGHT   -   RIGHT ARROW", windowWidth/2-150, windowHeight/2+50);
text("SHOOT        -   SPACEBAR", windowWidth/2-150, windowHeight/2+100);
text("PRESS 'ESC' TO RETURN TO MAIN MENU", windowWidth/2-200, windowHeight-20);

}
