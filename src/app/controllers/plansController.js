import Plans from '../models/Plans'
import * as Yup from 'yup'

const index = async (req, res) => {
  const plans = await Plans.findAll({
    attributes: ['id', 'title', 'duration', 'price'],
  })

  if (!plans) {
    return res.status(400).json({ message: 'no plans has found' })
  }

  return res.json(plans)
}

const show = async (req, res) => {
  const { id } = req.params

  const plan = await Plans.findByPk(id, {
    attributes: ['id', 'title', 'duration', 'price'],
  })

  if (!plan) {
    return res.status(400).json({ message: 'plan not found' })
  }

  return res.json(plan)
}

const store = async (req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    duration: Yup.number().required(),
    price: Yup.number().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ message: 'validation failed' })
  }

  const plan = await Plans.create(req.body)

  return res.json(plan)
}

const update = async (req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string(),
    duration: Yup.number(),
    price: Yup.number(),
  })

  if (!(await schema.isValid())) {
    return res.status(400).json({ message: 'validation failed' })
  }

  const { id } = req.params
  const plan = await Plans.findByPk(id)

  if (!plan) {
    return res.status(400).json({ message: 'plan not found' })
  }

  const updatedPlan = await plan.update(req.body)

  return res.json(updatedPlan)
}

const destroy = async (req, res) => {
  const { id } = req.params

  const plan = await Plans.findByPk(id)

  if (!plan) {
    return res.status(400).json({ message: 'plan not found' })
  }

  await plan.destroy()

  return res.json({ message: 'plan removed' })
}

export default { index, show, store, update, destroy }
