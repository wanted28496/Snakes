var folder = "";

if (!cc.sys.isNative){
    folder = "res/mediumRes/";
}


var res = {
    HelloWorld_png: folder + "HelloWorld.png",
    CloseNormal_png: folder + "CloseNormal.png",
    CloseSelected_png: folder + "CloseSelected.png",
    background: folder + "Background.jpg",
    snake_cell: "res/Snake_Head.png",
    snake_food: "res/Snake_Food.png",
    vertical: "res/vertical_obstacle.png",
    horizontal: "res/horizontal_obstacle.png",
    music_b: "res/Music_B.ogg",
    music_gl: "res/Music_GL.mp3",
    music_gw: "res/Music_GW.ogg",
    music_pick: "res/PlayerCoin.wav",
};

var INITIALIZED = false;
var snake_array = null;
var SnakeFood = null;
var Background = null;
var BackgroundWidth = 0;
var BackgroundHeight = 0;
var BackgroundPos;
var Direction = "right";
var Score = "";
var CellWidth = 30;
var Enum = { snakecell: 0, snakefood: 1, background: 2, obstacle: 3 };
var snakeLength = 5; //Length of the snake
var ScoreLabel;
var GameOverLabel;
var bCollisionDetected = false;
var level = 1;
var obstacleArray = null;

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
