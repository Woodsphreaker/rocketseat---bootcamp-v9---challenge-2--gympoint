import Checkins from '../models/Checkins'
import Students from '../models/Students'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import pt from 'date-fns/locale/pt'
import { Op } from 'sequelize'

const index = async (req, res) => {
  const { id } = req.params
  const { page = 1 } = req.query
  const pageSize = 10

  // Check if student exists
  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'Student not exists' })
  }

  // Get all student Checkins
  const checkins = await Checkins.findAll({
    where: {
      student_id: id,
    },
    attributes: ['created_at'],
    include: [
      {
        model: Students,
        as: 'student',
        attributes: ['name', 'email'],
      },
    ],
    limit: pageSize,
    offset: pageSize * ((page < 0 ? 1 : page) - 1),
  })

  if (!checkins.length) {
    return res.status(200).json({ message: 'no checkins yet' })
  }

  // eslint-disable-next-line camelcase
  const output = checkins.map(({ created_at, student }) => ({
    name: student.name,
    email: student.email,
    checkin: format(created_at, 'dd \'de\' MMMM \'de\' yyyy \'às\' hh:mm:ss:xxxx', {
      locale: pt,
    }),
  }))

  return res.json(output)
}

const store = async (req, res) => {
  const { id } = req.params

  // Check if student exists
  const student = await Students.findByPk(id)

  if (!student) {
    return res.status(400).json({ error: 'Student not exists' })
  }

  const currentDate = new Date()
  const startDate = startOfWeek(currentDate)
  const endDate = endOfWeek(startDate)

  // Check if checkins limit has been reached
  const checkins = await Checkins.findAndCountAll({
    where: {
      student_id: id,
      created_at: { [Op.between]: [startDate, endDate] },
    },
  })

  if (checkins.count === 5) {
    return res
      .status(400)
      .json({ error: 'the limit of 5 checkins in 7 days has been reached' })
  }

  const checkin = await Checkins.create({
    student_id: id,
  })

  return res.json(checkin)
}

export default { index, store }
