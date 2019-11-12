import Registrations from '../models/Registrations'
import Student from '../models/Students'
import Plans from '../models/Plans'
import { parseISO, addMonths, format } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Mail from '../../lib/Mail'
import * as Yup from 'yup'

import priceCalculate from '../../helpers/priceCalculate'

const index = async (req, res) => {
  const registrations = await Registrations.findAll({
    attributes: ['start_date', 'end_date', 'price', 'priceFormated'],
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['name', 'email'],
      },
      {
        model: Plans,
        as: 'plan',
        attributes: ['title', 'duration', 'price'],
      },
    ],
  })

  if (!registrations) {
    return res.status(400).json({ error: 'no registrations found' })
  }

  return res.json(registrations)
}
const show = async (req, res) => {
  return res.json({ message: 'show method' })
}
const store = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().required(),
    plan_id: Yup.number().required(),
    start_date: Yup.date().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations failed' })
  }

  // eslint-disable-next-line camelcase
  const { student_id, plan_id, start_date } = req.body

  /*
    verify if the student is already enrolled
  */
  const hasRegistration = await Registrations.findOne({
    where: { student_id },
  })

  if (hasRegistration) {
    return res.status(400).json({ error: 'the student already enrolled' })
  }

  /*
    verify if plan exists
  */
  const plan = await Plans.findByPk(plan_id)

  if (!plan) {
    return res.status(400).json({ error: 'Plan not exists' })
  }

  /*
    get student attributes
  */
  const student = await Student.findByPk(student_id, {
    attributes: ['name', 'email'],
  })

  if (!student) {
    return res.status(400).json({ error: 'Student not found' })
  }

  /*
    get plan attributes
  */
  const { title, duration, price } = plan
  const { name, email } = student

  const startPlanDate = parseISO(start_date)
  const endPlanDate = addMonths(startPlanDate, duration)
  const planPrice = priceCalculate(price, duration)

  await Registrations.create({
    student_id,
    plan_id,
    start_date: startPlanDate,
    end_date: endPlanDate,
    price: planPrice,
  })

  // Send Mail to student

  await Mail({
    subject: `Olá ${name}`,
    to: `${name} <${email}>`,
    html: `
      <strong> Seja bem vindo a academia GymPoint </strong>
      <p>
        <smal>Segue abaixo os detalhes de seu plano:</smal>
      </p>
      <p>
        Plano: ${title}
      </p>
      <p>
        Duração: de ${format(startPlanDate, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        })} até ${format(endPlanDate, "dd 'de' MMMM 'de' yyyy", {
      locale: pt,
    })}
      </p>
      <p>
        Valor: ${planPrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </p>
    `,
  }).send()

  return res.json({
    name,
    email,
    plan: title,
    duration,
    startDate: startPlanDate,
    endDate: endPlanDate,
    price: planPrice,
  })
}
const update = async (req, res) => {
  return res.json({ message: 'update method' })
}
const destroy = async (req, res) => {
  return res.json({ message: 'destroy method' })
}

export default { index, show, store, update, destroy }
