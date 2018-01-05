var INITIALIZED2 = false;
var typeg;
var LevelCompleteLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (text1,text2) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var winSize = cc.winSize;
        //cc.director.setClearColor(cc.color(255, 255, 255, 10));

        Background = new SpriteBackGround(res.background, cc.rect(0, 0, winSize.width - 50, winSize.height - 90));
        Background.setAnchorPoint(0, 0);
        Background.setTag(Enum.background);
        BackgroundWidth = Background.getBoundingBox().width;
        BackgroundHeight = Background.getBoundingBox().height;

        //Calculating Background Sprite position by subtratcing the background Sprite position from layer position
        Background.x = (winSize.width - BackgroundWidth) / 2;
        Background.y = (winSize.height - BackgroundHeight) / 2;
        this.addChild(Background, 0);
        BackgroundPos = { x: Background.x, y: Background.y };


        var redColor = cc.color(255, 0, 0);
        GamePausedLabel = new cc.LabelTTF(text1, "Arial", 100);
        GamePausedLabel.x = winSize.width / 2;
        GamePausedLabel.y = winSize.height / 2;
        GamePausedLabel.fillStyle = redColor
        GameLabel = new cc.LabelTTF(text2, "Arial", 38);
        GameLabel.x = winSize.width / 2;
        GameLabel.y = winSize.height / 2 - 100;
        GameLabel.fillStyle = redColor
        this.addChild(GameLabel, 5);
        this.addChild(GamePausedLabel, 5);
        GamePausedLabel.visible = true;
        GameLabel.visible = true;

        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            ////cc.log("Keyboard present");
            //cc.eventManager.addListener({
            //    event: cc.EventListener.KEYBOARD,
            //    onKeyPressed: function (key, event) {
            //        var target = event.getCurrentTarget();
            //        cc.log("Key Pressed is: " + key.toString());

            //        if (key.toString() == "32") {

            //            cc.audioEngine.resumeMusic();
            //            INITIALIZED2 = false;
            //            //cc.director.popScene();
            //        }
            //    },
            //}, this);
            eventL = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function (key, event) {
                    //cc.audioEngine.stopMusic()
                    cc.log("IN Event");
                    cc.eventManager.removeListener(eventL);
                    console.log("Event Dispacted !!");
                    var custom_event; //= new cc.EventCustom("Event From FeedBack Screen");
                    cc.log(key.toString() + " " + typeg);
                    if (key.toString() == "32") {
                        if (typeg == 2)
                            level++;
                        else if (typeg == 3)
                            level = 0;
                        INITIALIZED = false;
                        custom_event = new cc.EventCustom("Event From Complete Screen");
                        custom_event.setUserData("return to main screen from level complete");
                    } else if (key.toString() == "27") {
                        custom_event = new cc.EventCustom("Event From Paused Screen");
                        custom_event.setUserData("return to main screen from paused");
                        cc.audioEngine.playMusic(res.music_b, true);
                    }
                    INITIALIZED2 = false;
                    
                    cc.eventManager.dispatchEvent(custom_event);
                    //cc.director.runScene(new HelloWorldScene());
                }
            });
        } else {
            cc.log("Keyboard Not Supported");
        }
        cc.eventManager.addListener(eventL, 1);
        return true;
    },
    
});



var LevelComplete = cc.Scene.extend({
    data: "",
    ctor: function (data) {
        this._super();
        this.data = data;
        return true;
    },
    onEnter: function () {
        
        INITIALIZED2 = true;
        var text1 = "";
        var text2 = "";
        typeg = this.data;
        switch (this.data) {
            case 1: text1 = "Paused!!!";
                cc.audioEngine.stopMusic();
                text2 = "Press Escape to Continue";
                break;
            case 2: text1 = "Level Completed !!";
                cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(res.music_gw, true);
                text2 = "Press Space for next Level";
                break;
            case 3: text1 = "Level Lost!!!";
                text2 = "Press Space to Restart";
                cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(res.music_gl, true);
                level = 0;
                break;
        }
            var layer = new LevelCompleteLayer(text1, text2);
            this.addChild(layer);

    }
});
