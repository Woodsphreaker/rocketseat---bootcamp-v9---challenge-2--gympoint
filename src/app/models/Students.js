import Sequelize, { Model } from 'sequelize'

class Students extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.INTEGER,
        heigth: Sequelize.FLOAT,
      },
      {
        sequelize: connection,
      }
    )
    return this
  }
}

export default Students
