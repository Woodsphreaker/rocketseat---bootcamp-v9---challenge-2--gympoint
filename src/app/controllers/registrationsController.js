import Registrations from '../models/Registrations'
import Student from '../models/Students'
import Plans from '../models/Plans'

const index = async (req, res) => {
  const registrations = await Registrations.findAll({
    attributes: ['start_date', 'end_date'],
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
  return res.json({ message: 'store method' })
}
const update = async (req, res) => {
  return res.json({ message: 'update method' })
}
const destroy = async (req, res) => {
  return res.json({ message: 'destroy method' })
}

export default { index, show, store, update, destroy }
