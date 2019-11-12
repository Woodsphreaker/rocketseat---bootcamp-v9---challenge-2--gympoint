import nodeMailer from 'nodemailer'
import mailConfig from '../config/mail'

const transporter = nodeMailer.createTransport(mailConfig)

const defaultValues = {
  from: 'Equipe GymPoint <team@gympoint.com>',
  to: 'Usuário teste <user@teste.com>',
  subject: 'Hello',
  text: 'Hello ',
}

const sendMail = message => transporter.sendMail(message)

export default message => {
  return {
    send: () =>
      sendMail({
        ...defaultValues,
        ...message,
      }),
  }
}
