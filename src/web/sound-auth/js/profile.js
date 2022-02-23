$(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.history.replaceState({}, title, "/web/sound-auth/");
  }

  const isMobile = localStorage.getItem("type") === "mweb";
  if (isMobile) {
    $("#emit-sound").show();
  }
  $.ajax({
    url: "/v1/auth/profile",
    method: "GET",
    dataType: "json",
    contentType: "application/json",
    headers: {
      authorization: token,
    },
    error: (xhr, status, errorThrown) => {},
    success: (data) => {
      $("#email-heading").html(data?.data.email);
    },
  });
  Quiet.init({
    profilesPrefix: "/web/sound-auth/js/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/",
  });

  function onQuietReady() {
    let profilename = "audible";

    transmit = Quiet.transmitter({
      profile: profilename,
      frameLength: 100000,
      clampFrames: false,
      onFinish: onTransmitFinish,
    });
    function onTransmitFinish() {
      alert("message sent.");
    }
    $("#emit-sound").on("click", (e) => {
      $.ajax({
        url: "/v1/auth/sound-generate-token",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
          authorization: token,
        },
        error: (xhr, status, errorThrown) => {
          console.log("ffdsnfkj");
        },
        success: (data) => {
          transmit.transmit(Quiet.str2ab(":" + data?.data?.soundToken + ":"));
        },
      });
    });
  }
  function onQuietFail(reason) {
    console.log(`failed due to error ${reason}`);
  }
  Quiet.addReadyCallback(onQuietReady, onQuietFail);
});
