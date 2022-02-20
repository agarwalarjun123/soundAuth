$(() => {
  Quiet.init({
    profilesPrefix: "/web/sound-auth/js/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/",
  });


  function onTransmitFinish() {
    alert("message sent.");
  }
  function onQuietReady() {
    let profilename = "audible";
    transmit = Quiet.transmitter({
      profile: profilename,
      onFinish: onTransmitFinish,
    });
    $("#emit-sound").on("click", (e) => {
        $.ajax({
            url: "/v1/auth/sound-generate-token",
            method: "POST",
            dataType: "json",
            contentType:"application/json",
            headers: {
                authorization: token,
            },
            error : (xhr, status, errorThrown) => {
            },
            success: (data) => {
                transmit.transmit(Quiet.str2ab(data?.data?.soundToken));
            }
          });
      });
  }
  function onQuietFail(reason) {
    console.log(`failed due to error ${reason}`);
  }
  Quiet.addReadyCallback(onQuietReady, onQuietFail);

  const token = localStorage.getItem("token");
  if (!token) {
    window.history.replaceState({}, title, "/web/sound-auth/");
  }

 
});
