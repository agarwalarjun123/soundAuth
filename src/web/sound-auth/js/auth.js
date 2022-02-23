$(() => {
  setDeviceType();
  $("#send-button").on("click", (e) => {
    e.preventDefault();
    const email = $("#email").val();
    const source = "SOUND";

    $.ajax({
      url: "/v1/auth/request-otp",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ email, source }),
      error: (xhr, status, errorThrown) => {
        $("#otp-message-error").html(xhr.responseJSON.error.message);
      },
      success: (data) => {
        localStorage.setItem("session_id", data?.data?.session_id);
        $("#otp-message").html("OTP sent");
      },
    });
  });

  $("#otp-submit").on("click", (e) => {
    e.preventDefault();
    const otp = $("#otp").val();

    const session_id = localStorage.getItem("session_id");

    $.ajax({
      url: "/v1/auth/validate-otp",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ otp, session_id }),
      error: (xhr, status, errorThrown) => {},
      success: (data) => {
        console.log("data", data);
        localStorage.setItem("token", data?.data?.token);
        localStorage.removeItem("session_id");
        window.location.href = "/web/sound-auth/profile.html";
      },
    });
  });
  $("#soundauth-button").on("click", () => {
    setupSoundReceiver();
  });
  $("#show-otp").on("click", (e) => {
    $("#otp-container").show();
    $("#soundauth-container").hide();
  });
  $("#show-sound-auth").on("click", () => {
    $("#soundauth-container").show();
    $("#otp-container").hide();
  });
});
function setupSoundReceiver() {
  let token = ''
  let valid = false
  function onQuietReady() {
    var profilename = "audible";
    Quiet.receiver({
      profile: profilename,
      frameLength: 100000,
      onReceive: onReceive,
      onCreateFail: onReceiverCreateFail,
      onReceiveFail: onReceiveFail,
    });
    function onReceive(recvPayload) {
      const payload = Quiet.ab2str(recvPayload)
      console.log(payload)
      if(!valid && payload[0] === ':'){
        valid = true
        token = payload.slice(1)
        return;
      }
      if(valid && payload[payload.length - 1] === ':') {
        token += payload.slice(0,-1);
        validateSoundToken(token)
        return;
      }
      if(valid) {
        token += payload
      }

    }
    function validateSoundToken(token) {
      $.ajax({
        url: "/v1/auth/sound-validate-token",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
          soundauthorization: token
        },
        error: (xhr, status, errorThrown) => {
          valid = false;
          token = ''
          console.log(xhr.response.data)
        },
        success: (data) => {
          console.log("ddd")
          valid = false;
          token = ''
          localStorage.setItem("token", data?.data?.token);
          window.location.href = "/web/sound-auth/profile.html";
        },
      });
      
    } 

    function onReceiverCreateFail(reason) {
      console.log("failed to create quiet receiver: " + reason);
    }

    function onReceiveFail() {
      valid = false;
      token = ''
    }
  }
  Quiet.init({
    profilesPrefix: "/web/sound-auth/js/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/",
  });
  function onQuietFail(reason) {
    console.log("quiet failed to initialize: " + reason);
  }

  Quiet.addReadyCallback(onQuietReady, onQuietFail);
}


function setDeviceType() {
  let isMobileDevice = window.matchMedia("only screen and (max-width: 760px)")
    .matches;
  if (isMobileDevice) {
    localStorage.setItem("type", "mweb");
  } else {
    localStorage.setItem("type", "dweb");
  }
}
