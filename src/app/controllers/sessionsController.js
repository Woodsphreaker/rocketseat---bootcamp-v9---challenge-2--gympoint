import jwt from 'jsonwebtoken'
import auth from '../../config/auth'
import bcrypt from 'bcrypt'
import Users from '../models/Users'

const store = async (req, res, next) => {
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

  res.json({
    token,
  })
}

export default { store }
