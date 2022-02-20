const crypto = require("crypto")
const generateOTP = () =>{
    const otp = Array(6).fill(0).map(() => Math.floor(Math.random() * 10)).join("")
    const hashedOTP = crypto.createHash('sha1').update(otp).digest('hex')
    return {
        otp, hashedOTP
    }
}
const hashOTP = (otp) => {
    const hashedOTP = crypto.createHash('sha1').update(otp).digest('hex')
    return hashedOTP
}

module.exports = {
    generateOTP,
    hashOTP
}