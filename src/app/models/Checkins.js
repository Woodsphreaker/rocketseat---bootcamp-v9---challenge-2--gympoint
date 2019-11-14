import Sequelize, { Model } from 'sequelize'

class Checkins extends Model {
  static init(connection) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
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

export default Checkins
