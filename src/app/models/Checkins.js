import Sequelize, { Model } from 'sequelize'

class ModelName extends Model {
  static init(connection) {
    super.init(
      {
        created_at: Sequelize.INTEGER,
        updated_at: Sequelize.INTEGER,
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

export default ModelName
