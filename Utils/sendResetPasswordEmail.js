const sendEmail = require('./sendEmail')

const send_Reset_Password_Email = async ({ name, email, token, origin }) => {
  const reset_Password_URL = `${origin}/user/reset-password?token=${token}&email=${email}`
  const message = `<p>Please click the reset password link to reset your password: <a href="${reset_Password_URL}"> Reset Password</a></p>`

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h2>Hello, ${name}!</h2> ${message}`,
  })
}

module.exports = send_Reset_Password_Email
