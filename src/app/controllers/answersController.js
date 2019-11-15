import HelpOrders from '../models/HelpOrders'
import Students from '../models/Students'
import { Op } from 'sequelize'
import formatDate from '../../helpers/formatDate'
import * as Yup from 'yup'
import Mail from '../../lib/Mail'

// responder a um estudante sobre sua dúvida

const index = async (req, res) => {
  const unansweredQuestions = await HelpOrders.findAll({
    where: {
      answer: {
        [Op.is]: null,
      },
    },
    attributes: ['id', 'question', 'created_at'],
    include: [
      {
        model: Students,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    ],
  })

  if (!unansweredQuestions.length) {
    return res.json({ message: 'no questions found' })
  }

  const output = unansweredQuestions.map(
    // eslint-disable-next-line camelcase
    ({ id, question, created_at, student }) => ({
      id,
      question,
      questionDate: formatDate(created_at),
      name: student.name,
      email: student.email,
    })
  )

  return res.json(output)
}

const store = async (req, res) => {
  const schema = Yup.object().shape({
    answer: Yup.string().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations failed' })
  }

  const { id } = req.params
  const { answer } = req.body

  const helpOrder = await HelpOrders.findOne({
    where: {
      id,
      answer: {
        [Op.is]: null,
      },
    },
    include: [
      {
        model: Students,
        as: 'student',
      },
    ],
  })

  if (!helpOrder) {
    return res.status(400).json({
      error: 'no question found or this question has already been answered ',
    })
  }

  const answered = await helpOrder.update({
    answer,
    answer_at: new Date(),
  })

  const { question, created_at, answer_at, student } = answered

  await Mail({
    to: `${student.name} <${student.email}>`,
    subject: `Olá ${student.name}, sua pergunta foi respondida`,
    html: `
      <strong> Respondemos sua pergunta !</strong>
      <p>
        Sua Pergunta: ${question}
      </p>
      <p>
        Nossa Resposta: ${answer}
      </p>
      <p>Você perguntou em ${formatDate(created_at)}</p>
      <p>Nós respondemos em ${formatDate(answer_at)}</p>
    `,
  }).send()

  return res.json(answered)
}

export default { index, store }
