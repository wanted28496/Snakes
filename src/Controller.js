
var controlLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var mainScreenEventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "Event From Main Screen",
            callback: function (event) {
                console.log("Load FeedBack Screen !!" + event.getUserData());
                if (event.getUserData() == "Level Complete")
                    cc.director.runScene(new LevelComplete(2));
                if (event.getUserData() == "Level Paused")
                    cc.director.pushScene(new LevelComplete(1));
                if (event.getUserData() == "Level Lose")
                    cc.director.pushScene(new LevelComplete(3));
                
            }
        });
        cc.eventManager.addListener(mainScreenEventListener, 2);
        //-------------------------------------------------------------------------
        var CompleteScreenEventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "Event From Complete Screen",
            callback: function (event) {
                console.log("Load Main Screen !!" + event.getUserData());
                cc.audioEngine.stopMusic();
                //cc.audioEngine.playMusic(res.music_b, true);
                //debugger;
                Direction = "right";
                cc.director.runScene(new HelloWorldScene());
            }
        });
        var PausedScreenEventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "Event From Paused Screen",
            callback: function (event) {
                console.log("Load Main Screen !!" + event.getUserData());
                cc.director.popScene();
                
            }
        });
        cc.eventManager.addListener(CompleteScreenEventListener, 2);
        cc.eventManager.addListener(PausedScreenEventListener, 2);
        //debugger;
        level = 0;
        cc.director.runScene(new HelloWorldScene());
    }
});
var controlScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var controlL = new controlLayer();
        this.addChild(controlL);
    }
});