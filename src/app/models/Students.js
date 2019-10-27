import Sequelize, { Model } from 'sequelize'

class Students extends Model {
  static init(connection) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.INTEGER,
        altura: Sequelize.FLOAT,
      },
      {
        sequelize: connection,
      }
    )
  }
}

export default Students
