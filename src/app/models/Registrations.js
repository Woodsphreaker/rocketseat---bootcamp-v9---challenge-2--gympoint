import Sequelize, { Model } from 'sequelize'

class Registrations extends Model {
  static init(connection) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER,
        priceFormated: {
          type: Sequelize.VIRTUAL,
          get() {
            return 'test'
          },
        },
      },
      {
        sequelize: connection,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Students, { foreignKey: 'student_id', as: 'student' })
    this.belongsTo(models.Plans, { foreignKey: 'plan_id', as: 'plan' })
  }
}

export default Registrations
