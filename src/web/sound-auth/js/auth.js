$(() => {
  Quiet.init({
    profilesPrefix: "/web/sound-auth/js/",
    memoryInitializerPrefix: "/",
    libfecPrefix: "/",
  });

  Quiet.addReadyCallback(onQuietReady, onQuietFail);

  function onTransmitFinish() {
    alert("message sent.");
  }
  $("#send-button").on("click", (e) => {
    e.preventDefault();
    const email = $("#email").val();
    const source = "SOUND";

    $.ajax({
      url: "/v1/auth/request-otp",
      method: "POST",
      dataType: "json",
      contentType:"application/json",
      data: JSON.stringify({ email, source }),
      error : (xhr, status, errorThrown) => {
        $("#otp-message-error").html(xhr.responseJSON.error.message)
      },
      success: (data) => {
        localStorage.setItem('session_id',data?.data?.session_id);
        $("#otp-message").html("OTP sent")
      }
    });
  });

  $("#otp-submit").on('click',(e) => {
    e.preventDefault()
    const otp = $("#otp").val()
    const session_id = localStorage.getItem('session_id')

    $.ajax({
      url: "/v1/auth/validate-otp",
      method: "POST",
      dataType: "json",
      contentType:"application/json",
      data: JSON.stringify({ otp, session_id }),
      error : (xhr, status, errorThrown) => {
      },
      success: (data) => {
        console.log("data",data)
        localStorage.setItem('token',data?.data?.token);
        localStorage.removeItem('session_id')
        window.location.href = "/web/sound-auth/profile.html";
      }
    });
  })

  function onQuietReady() {
    let profilename = "audible";
    transmit = Quiet.transmitter({
      profile: profilename,
      onFinish: onTransmitFinish,
    });
  }
  function onQuietFail(reason) {
    console.log(`failed due to error ${reason}`);
  }
});
