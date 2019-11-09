import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class Users extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
      },
      {
        sequelize: connection,
      }
    )

    this.addHook('beforeSave', async user => {
      if (user.password) {
        return (user.password_hash = await bcrypt.hash(user.password, 8))
      }
    })

    return this
  }

  checkPassword(oldPassword) {
    return bcrypt.compare(oldPassword, this.password_hash)
  }
}

export default Users
