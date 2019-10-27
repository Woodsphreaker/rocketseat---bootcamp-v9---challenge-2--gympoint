import Sequelize, { Model } from 'sequelize'

class Students extends Model {
  static init (connection) {
    super.init({
      nome: Sequelize.STRING,
      email: Sequelize.STRING,
      idate: Sequelize.INTERGER,
      peso: Sequelize.INTEGER,
      altura: Sequelize.FLOAT

    }, {
      sequelize: connection
    })
  }
}

export default Students
