import jwt from 'jsonwebtoken'
import auth from '../../config/auth'
import bcrypt from 'bcrypt'
import * as Yup from 'yup'
import Users from '../models/Users'
import jwtValidations from '../schemas/jwtValidations'

const store = async (req, res, next) => {
  const schema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(401).json({ error: 'Required fields are missing' })
  }
  const { email, password } = req.body

  const user = await Users.findOne({ where: { email } })

  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  if (!(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'password not match' })
  }

  const { id } = user

  const token = jwt.sign({ id }, auth.secret, {
    expiresIn: auth.expires,
  })

  await jwtValidations.findOneAndUpdate(
    {
      userID: id,
      isValid: true,
    },
    {
      isValid: false,
    }
  )

  await jwtValidations.create({
    userID: id,
    token,
    isValid: true,
  })

  res.json({
    token,
  })
}

export default { store }
