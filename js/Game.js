class Game {
  constructor() {
    this.resetButton = createButton([]);
    this.resetTitle = createElement("h2");

    this.leaderBoard = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

  }
  handelElements()
  {
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reset");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);

    this.leaderBoard.html("leaderBoard");
    this.leaderBoard.class("resetText");
    this.leaderBoard.position(width/3-60,40);
    
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,120);

  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getPlayerCount();
    car1 = createSprite(200,200,20,20);
    car1.addImage(car1Image);
    car1.scale = 0.08;
    car2 = createSprite(400,200,20,20);
    car2.addImage(car2Image);
    car2.scale = 0.08;
    cars = [car1,car2];
    
    fuels = new Group();
    this.addSprites(fuels,10,fuel,0.02);
    coins = new Group();
    this.addSprites(coins,50,coin,0.08);
  }
  getGameState()
  {
    var gameRef = database.ref("gameState");
    gameRef.on("value",(data)=>{
      gameState = data.val();
    })
  }
  updateGameState(count)
  {
    var gameRef = database.ref("/");
    gameRef.update({
      gameState: count
    });
  }
  play()
  {
    form.hide();
    this.handelResetButton();
    Player.getPlayers();
    if(allPlayers !== undefined)
    {
      image(track,0,-height*5,width,height*6);
      this.handelElements();
      this.showLeaderBoard();
      
      var index = 0;
      for(var obj in allPlayers)
      {
        index = index+1;
        var x = allPlayers[obj].positionX;
        var y = height-100;
        this.fuelBar();
        if(x === 0 && index === 1)
        {
          x = width/2-100;
        }
        else if(x === 0 && index === 2)
        {
          x = width/2+100;
        }
        allPlayers[obj].positionX = x;
        cars[index-1].position.x = x;
        cars[index-1].position.y = y-allPlayers[obj].positionY;
        if(index === player.index)
        {
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
          fill("red");
          ellipse( cars[index-1].position.x, cars[index-1].position.y,60,60);
          this.handelFuel(index);
          this.handelCoin(index);
          
        }
        
      }
      if(player.index !== null)
      {
        this.handelPlayerControl();
      }    

      drawSprites();
    }
  }

  handelPlayerControl()
  {
    if(keyIsDown(UP_ARROW) )
    {
      player.positionY = player.positionY+10;
      player.updatePlayer();
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300 )
    {
      player.positionX = player.positionX+5;
      player.updatePlayer();
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50 )
    {
      player.positionX = player.positionX-5;
      player.updatePlayer();
    }

  }
  showLeaderBoard()
  {
    var leader1,leader2;
    debugger;
    var players = Object.values(allPlayers);
    console.log(players);
    if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1)
    {
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    if(players[1].rank === 1)
    {
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handelResetButton()
  {
    this.resetButton.mousePressed(()=>{
      
      database.ref('/').update({
        playerCount:0,
        gameState:0,
        players:{}
      })
      window.location.reload();
    })

  }
  addSprites(spriteGroup,numberOfSprites,spriteImage,scale)
  {
      for(var i=0;i<numberOfSprites;i++)
      {
        var x = random(width/2-200,width/2+200);
        var y = random((-height*5)+200,height-400);
        var sprite = createSprite(x,y,20,20);
        sprite.addImage(spriteImage);
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
  }
  handelFuel(index)
  {
      cars[index-1].overlap(fuels,(collector,collected)=>{
        collected.remove();
        player.fuel = 185;
      })
      if(player.fuel>0)
      {
        player.fuel = player.fuel-0.3;
        
      }
      if(player.fuel <= 0 )
      {
        gameState = 2;
      }
  }
  handelCoin(index)
  {
    cars[index-1].overlap(coins,(collector,collected)=>{
      collected.remove();
      player.score = player.score+20;
    })
    
  }
  fuelBar()
  {
    image(fuel,width/2-200,height-player.y-100,10,10);
    push();
    fill('white');
    rect(width/2-150,height-player.y-100,185,20);
    fill('green');
    rect(width/2-150,height-player.y-100,player.fuel,20);
    pop();

  }
  
}
