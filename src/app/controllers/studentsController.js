import Students from '../models/Students'
import * as Yup from 'yup'

const index = async (req, res) => {
  const students = await Students.findAll()

  if (!students) {
    return res.json({ message: 'no students found' })
  }

  const mappedStudents = students.map(
    ({ name, email, age, weight, heigth }) => ({
      name,
      email,
      age,
      weight,
      heigth,
    })
  )

  res.json(mappedStudents)
}
const show = async (req, res) => {
  const { id } = req.params

  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'student not found' })
  }

  const { name, email, age, weight, heigth } = student

  res.json({
    name,
    email,
    age,
    weight,
    heigth,
  })
}
const store = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    age: Yup.number().required(),
    weight: Yup.number().required(),
    heigth: Yup.number().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      error: 'Required fields are missing or fields types is not valid',
    })
  }

  const { email } = req.body

  const student = await Students.findOne({ where: { email } })

  if (student) {
    return res.status(400).json({ error: 'this student already exists' })
  }

  const { id, name, age, weight, heigth } = await Students.create(req.body)

  res.json({
    id,
    name,
    email,
    age,
    weight,
    heigth,
    message: 'student created',
  })
}
const update = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    age: Yup.number(),
    weight: Yup.number(),
    heigth: Yup.number(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({
      error: 'Some fields types is not valid',
    })
  }

  const { id } = req.params
  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'student not found' })
  }

  const { email: currentEmail } = req.body

  if (currentEmail) {
    if (currentEmail !== student.email) {
      const exists = await Students.findOne({
        where: { email: currentEmail },
      })

      if (exists) {
        return res.status(400).json({ error: 'this email already exists' })
      }
    }
  }

  const { name, email, age, weight, heigth } = await student.update(req.body)

  res.json({
    id,
    name,
    email,
    age,
    weight,
    heigth,
  })
}
const destroy = async (req, res) => {
  const { id } = req.params

  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'student not found' })
  }

  Students.destroy({ where: { id } })

  res.json({ message: 'Studend deleted' })
}

export default { index, show, store, update, destroy }
