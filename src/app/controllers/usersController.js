import Users from '../models/Users'
import * as Yup from 'yup'

const index = async (req, res) => {
  const users = await Users.findAll({
    attributes: ['id', 'name', 'email'],
  })

  if (!users) {
    return res.status(400).json({ error: 'no users found' })
  }

  return res.json(users)
}

const show = async (req, res) => {
  const { id } = req.params

  const user = await Users.findByPk(id)

  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  const { name, email } = user

  res.json({
    id,
    name,
    email,
  })
}

const store = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .required()
      .min(6),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      error: 'Required fields are missing or some fields is not valid',
    })
  }

  const { email } = req.body

  const user = await Users.findOne({ where: { email } })

  if (user) {
    return res.status(400).json({ error: 'user already exists' })
  }

  const { id, name, password } = await Users.create(req.body)

  return res.json({
    id,
    name,
    email,
    password,
  })
}

const update = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string(),
    oldPassword: Yup.string(),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) => {
        return oldPassword ? field.required() : field
      }),
    confirmPassword: Yup.string().when('password', (password, field) => {
      return password ? field.required().oneOf([Yup.ref('password')]) : field
    }),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      error: 'Required fields are missing or some fields is not valid',
    })
  }

  const { id } = req.params
  const { email, oldPassword } = req.body

  const user = await Users.findByPk(id)

  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  if (email) {
    if (email !== user.email) {
      const exists = await Users.findOne({ where: { email } })
      if (exists) {
        return res.status(400).json({ error: 'this email already exists' })
      }
    }
  }

  if (oldPassword && !(await user.checkPassword(oldPassword))) {
    return res.status(400).json({ error: 'old password not match' })
  }

  const { name } = await user.update(req.body)

  res.json({
    id,
    name,
    email,
  })
}

const destroy = async (req, res) => {
  const { id } = req.params

  const user = await Users.findByPk(id)

  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  await user.destroy()

  res.json({ message: 'user deleted' })
}

export default { index, show, store, update, destroy }
