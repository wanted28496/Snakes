//import Snake from 'Snake.js';
//The Background sprite class holding the game nodes
var SpriteBackGround = cc.Sprite.extend({
    ctor: function (texture, rect) {
        this._super(texture, rect);
    }
});

//Snake cell class 
var SpriteSnakeCell = cc.Sprite.extend({
    ctor: function (texture) {
        this._super(texture);
    }
});

var ObstacleBar = cc.Sprite.extend({
    ctor: function (texture) {
        this._super(texture);
    }
});

//Snake food class 
var SpriteSnakeFood = cc.Sprite.extend({
    ctor: function (texture) {
        this._super(texture);
    }
});


var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    bac: null,
    gl: null,
    pick: null,
    ctor: function () {


        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        

        //Game Background Sprite: 
        Background = new SpriteBackGround(res.background, cc.rect(0, 0, size.width - 50, size.height - 90));
        Background.setAnchorPoint(0, 0);
        Background.setTag(Enum.background);
        BackgroundWidth = Background.getBoundingBox().width;
        BackgroundHeight = Background.getBoundingBox().height;

        //Calculating Background Sprite position by subtratcing the background Sprite position from layer position
        Background.x = (size.width - BackgroundWidth) / 2;
        Background.y = (size.height - BackgroundHeight) / 2;
        this.addChild(Background, 0);
        BackgroundPos = { x: Background.x, y: Background.y };
        //cc.log("PositionX : " + BackgroundWidth + "PositionY : " + BackgroundHeight);


        //creating obstacle
        obstacleArray = [];
        for (var i = 0; i < level; i++){
            
            var obstacleBar;
            if (Math.random() >= 0.5) {
                obstacleBar = new ObstacleBar(res.vertical);
                rndValX = generate(Background.x, BackgroundWidth, 30);
                rndValY = generate(Background.y, BackgroundHeight, 180);
            } else {
                obstacleBar = new ObstacleBar(res.horizontal);
                rndValX = generate(Background.x, BackgroundWidth, 180);
                rndValY = generate(Background.y, BackgroundHeight, 30);
            }
            
            var irndX = rndValX;
            var irndY = rndValY;
            obstacleBar.x = irndX;
            obstacleBar.y = irndY;
            obstacleBar.setAnchorPoint(0, 0);
            obstacleBar.setTag(Enum.obstacle);
            this.addChild(obstacleBar, 2);
            var ob_box = obstacleBar.getBoundingBox();
            obstacleArray.push(obstacleBar);
        }

        //Adding Score Label to the screen
        ScoreLabel = new cc.LabelTTF(setLabelString(Score.toString()), "Arial");
        ScoreLabel.setFontSize(38);
        ScoreLabel.x = size.width / 2;
        ScoreLabel.y = size.height / 2 + 200;
        ScoreLabel.fillStyle = cc.color(0, 0, 0);
        this.addChild(ScoreLabel, 5);

        var redColor = cc.color(255, 0, 0);
        GameOverLabel = new cc.LabelTTF("Game Over press SPACE to restart!", "Arial", 38);
        GameOverLabel.x = size.width / 2;
        GameOverLabel.y = size.height / 2;
        GameOverLabel.fillStyle = redColor
        this.addChild(GameOverLabel, 5);
        GameOverLabel.visible = false;

        GameLevelLabel = new cc.LabelTTF("Level: " + level, "Arial", 20);
        redColor = cc.color(255, 255, 255, 255);
        GameLevelLabel.x = 100;
        GameLevelLabel.y = 20;
        GameLevelLabel.fillStyle = redColor
        this.addChild(GameLevelLabel, 5);
        GameLevelLabel.visible = true;
        //var sprite = new cc.Sprite.create(res.CloseSelected_png);
        //sprite.setAnchorPoint(cc.p(0.5, 0.5));
        //sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        //this.addChild(sprite, 1);


        //adding Music to Game
        cc.audioEngine.playMusic(res.music_b, true);
        cc.audioEngine.setMusicVolume(0.2);

        //Createing Snake and food
        this.CreateSnake();
        this.CreateFood();

        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            //cc.log("Keyboard present");
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    var target = event.getCurrentTarget();
                    //cc.log("Key Pressed is: " + key.toString());
                    //Only if space key is pressed and Collision Detected the game restart
                    if (bCollisionDetected && key.toString() == "32") {
                        Direction = "right";
                        bCollisionDetected = false;
                        //GameOverLabel.visible = false;
                        //cc.audioEngine.stopMusic()
                        //cc.audioEngine.playMusic(res.music_b, true);
                        //cc.director.resume();
                        //target.CreateSnake();
                        //target.CreateFood();
                        return;
                    }
                    
                    if (key.toString() == "37" || key.toString() == "65" && Direction != "right")
                        Direction = "left";
                    else if (key.toString() == "38" || key.toString() == "87" && Direction != "down")
                        Direction = "up";
                    else if (key.toString() == "39" || key.toString() == "68" && Direction != "left")
                        Direction = "right";
                    else if (key.toString() == "40" || key.toString() == "83" && Direction != "up")
                        Direction = "down";
                    //cc.log("Direction :" + Direction);

                    if (key.toString() == "27") {
                        //var scene = new HelloWorldScene2();
                        //cc.audioEngine.pauseMusic();
                        //cc.director.pushScene(scene);
                        var custom_event = new cc.EventCustom("Event From Main Screen");
                        custom_event.setUserData("Level Paused");
                        cc.eventManager.dispatchEvent(custom_event);
                    }
                },
            }, this);
        } else {
            cc.log("Keyboard Not Supported");
        }

        this.schedule(this.GameLoop, 0.1);

        return true;
    },
    CreateSnake: function(){
        Score = 0;
        ScoreLabel.setString(setLabelString(Score));
        direction = "right";
        if ((typeof snake_array != 'undefined' && snake_array instanceof Array) && snake_array.length > 0) {
            for (var i = 0; i < snake_array.length; i++) {
                this.removeChild(snake_array[i], true);
            }
        }
        snake_array = [];
        var elmsToRemove = snake_array.length - length;
        if (elmsToRemove > 1) {
            snake_array.splice(snakeLength - 1, elmsToRemove);
        }
        for (var i = snakeLength - 1; i >= 0; i--) {
            var spriteSnakeCell = new SpriteSnakeCell(res.snake_cell);
            spriteSnakeCell.setAnchorPoint(0, 0);
            spriteSnakeCell.setTag(Enum.snakecell);
            var xMov = (i * CellWidth) + BackgroundPos.x;
            var yMov = (Background.y + BackgroundHeight) - CellWidth;
            spriteSnakeCell.x = xMov;
            spriteSnakeCell.y = yMov;
            this.addChild(spriteSnakeCell, 2);
            snake_array.push(spriteSnakeCell);
        }
    },
    CreateFood: function () {
        //Check if food Exist , remove it from the game sprite
        if (this.getChildByTag(Enum.snakefood) != null) {
            this.removeChildByTag(Enum.snakefood, true);
        }
        var spriteSnakeFood = new SpriteSnakeFood(res.snake_food);
        spriteSnakeFood.setAnchorPoint(0, 0);
        spriteSnakeFood.setTag(Enum.snakefood);
        this.addChild(spriteSnakeFood, 2);
        var rndValX = 0;
        var rndValY = 0;
        var min = 0;
        var maxWidth = BackgroundWidth;
        var maxHeight = BackgroundHeight;
        var multiple = CellWidth;
        //Place it in some random position 
        rndValX = generate(min, maxWidth, multiple);
        rndValY = generate(min, maxHeight, multiple);
        var irndX = rndValX + BackgroundPos.x;
        var irndY = rndValY + BackgroundPos.y;
        SnakeFood = {
            x: irndX,
            y: irndY
        };

        spriteSnakeFood.x = SnakeFood.x;
        spriteSnakeFood.y = SnakeFood.y;
    },
    GameLoop: function (dt) {
        //get the snake head cell
        //cc.log(Direction);
        var SnakeHeadX = snake_array[0].x;
        var SnakeHeadY = snake_array[0].y;
        var snakeHead = snake_array[0].getBoundingBox();
        //check which direction it is heading  
        switch (Direction) {
            case "right":
                //cc.log("In Switch");
                SnakeHeadX = SnakeHeadX + CellWidth;
                break;
            case "left":
                SnakeHeadX = SnakeHeadX - CellWidth;
                break;
            case "up":
                SnakeHeadY = SnakeHeadY + CellWidth;
                break;
            case "down":
                SnakeHeadY = SnakeHeadY - CellWidth;
                break;
            default:
                cc.log("direction not defind");
        }
        if (Collision(SnakeHeadX, SnakeHeadY, snake_array, obstacleArray, snakeHead)) {
            //cc.audioEngine.stopMusic();
            //cc.audioEngine.playMusic(res.music_gl, true);
            //bCollisionDetected = true;
            //GameOverLabel.visible = true;
            //cc.director.pause();
            var custom_event = new cc.EventCustom("Event From Main Screen");
            custom_event.setUserData("Level Lose");
            cc.eventManager.dispatchEvent(custom_event);
        }

        if (SnakeHeadX == SnakeFood.x && SnakeHeadY == SnakeFood.y) {
            //Add snake cell after the head position
            cc.audioEngine.playEffect(res.music_pick);
            var spriteSnaketail = new SpriteSnakeCell(res.snake_cell);
            spriteSnaketail.setAnchorPoint(0, 0);
            spriteSnaketail.setTag(Enum.snakecell);
            this.addChild(spriteSnaketail, 2);
            spriteSnaketail.x = SnakeHeadX;
            spriteSnaketail.y = SnakeHeadY;
            snake_array.unshift(spriteSnaketail);
            //Add point to the points display
            ScoreLabel.setString(setLabelString(Score++));

            if (Score == 3) {
                //cc.log("Score >= 10");
                var custom_event = new cc.EventCustom("Event From Main Screen");
                custom_event.setUserData("Level Complete");
                cc.eventManager.dispatchEvent(custom_event);
            }

            //Create new food in new position
            this.CreateFood();
        } else {
            var spriteSnakeCellLast = snake_array.pop(); //pops out the last cell
            spriteSnakeCellLast.x = SnakeHeadX;
            spriteSnakeCellLast.y = SnakeHeadY;
            snake_array.unshift(spriteSnakeCellLast);
        }
        //cc.log("SankeHead X: " + SnakeHeadX + "  SnakeHead Y: " + SnakeHeadY);
    }
});


function Collision(x, y, snake_arr, ob_arr, head) {
    if (x < Background.x || y < Background.y || x > BackgroundWidth || y > (BackgroundHeight + CellWidth)) {
        return true;
    }

    for (var i = 1; i < snake_arr.length;i++){
        if (snake_arr[i].x == x && snake_arr[i].y == y) {
            return true;
        }
    }

    for (var i = 0; i < level; i++) {
        if (cc.rectIntersectsRect(head, ob_arr[i]))
            return true;
    }
}

function setLabelString(str) {
    var stringScore = parseInt(Score).toString();
    return stringScore;
}


function generate(min, max, multiple) {
    var res = Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
    return res;
}


var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        if (INITIALIZED == false) {
            INITIALIZED = true;
            var layer = new HelloWorldLayer();
            this.addChild(layer);
        }

    }
});

