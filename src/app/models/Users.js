import Sequelize, { Model } from 'sequelize'

class User extends Model {
  static init (connection) {
    super.init({
      name: Sequelize.INTERGER,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING
    }, {
      sequelize: connection
    })
  }
}

export default User
