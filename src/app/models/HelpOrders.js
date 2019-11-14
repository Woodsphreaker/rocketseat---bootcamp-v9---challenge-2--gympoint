import Sequelize, { Model } from 'sequelize'

class HelpOrders extends Model {
  static init(connection) {
    super.init(
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize: connection,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Students, { foreignKey: 'student_id', as: 'student' })
  }
}

export default HelpOrders
