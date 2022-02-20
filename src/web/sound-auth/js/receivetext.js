$(() => {
    function onReceive(recvPayload) {
        var content = new ArrayBuffer(0);
        content = Quiet.mergeab(content, recvPayload);
        console.log(Quiet.ab2str(content));
    };

    function onReceiverCreateFail(reason) {
        console.log("failed to create quiet receiver: " + reason);
    };

    function onReceiveFail(num_fails) {
        console.log("on_receiver create fail")
    };

    
    
    $("#receive-button").on('click', () => {
        function onQuietReady() {
            var profilename = "audible";
            Quiet.receiver({profile: profilename,
                 onReceive: onReceive,
                 onCreateFail: onReceiverCreateFail,
                 onReceiveFail: onReceiveFail
            });
          
        };
        Quiet.init({
            profilesPrefix: "/web/sound-auth/js/",
            memoryInitializerPrefix: "/",
            libfecPrefix: "/",
        });
        function onQuietFail(reason) {
            console.log("quiet failed to initialize: " + reason);
        };
        
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    
    })

    
    
   
})
