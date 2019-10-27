import Sequelize, { Model } from 'sequelize'

class Users extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize: connection,
      }
    )
  }
}

export default Users
