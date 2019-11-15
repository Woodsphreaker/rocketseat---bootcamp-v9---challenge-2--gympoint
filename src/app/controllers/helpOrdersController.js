import HelpOrders from '../models/HelpOrders'
import Students from '../models/Students'
import formatDate from '../../helpers/formatDate'
import * as Yup from 'yup'

// Criar lógica

const index = async (req, res) => {
  const { id } = req.params

  // Check if student exists
  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'student not exists' })
  }

  const orders = await HelpOrders.findAll({
    where: {
      student_id: id,
    },
    // attributes: ['question', 'answer', 'answer_at'],
    include: [
      {
        model: Students,
        as: 'student',
        attributes: ['name', 'email'],
      },
    ],
  })

  const output = orders.map(
    // eslint-disable-next-line camelcase
    ({ question, answer, createdAt, answer_at, student }) => ({
      name: student.name,
      email: student.email,
      question,
      answer: answer || 'N/D',
      // eslint-disable-next-line camelcase
      answer_at: answer_at ? formatDate(answer_at) : 'N/D',
      questionDate: formatDate(createdAt),
    })
  )

  return res.json(output)
}

const store = async (req, res) => {
  const schema = Yup.object().shape({
    question: Yup.string()
      .required()
      .min(10),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'validations failed' })
  }

  const { id } = req.params
  const { question } = req.body

  // Check if student exists
  const student = await Students.findByPk(id, {
    attributes: ['name', 'email'],
  })

  if (!student) {
    return res.status(400).json({ error: 'student not exists' })
  }

  const helpOrder = await HelpOrders.create({
    student_id: id,
    question,
  })

  const { name, email } = student
  const { createdAt } = helpOrder

  return res.json({
    name,
    email,
    createdAt: formatDate(createdAt),
  })
}

export default { index, store }
