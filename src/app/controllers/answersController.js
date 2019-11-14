import HelpOrders from '../models/HelpOrders'
import Students from '../models/Students'

// responder a um estudante sobre sua dúvida

const index = async (req, res) => {
  return res.json({ message: 'index method' })
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
