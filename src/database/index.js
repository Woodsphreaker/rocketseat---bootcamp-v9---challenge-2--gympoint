import Sequelize from 'sequelize'
import databaseConfig from '../config/database'

// Models
import Users from '../app/models/Users'
import Students from '../app/models/Students'

const models = [Users, Students]

class Database {
  constructor () {
    this.init()
  }

  init () {
    this.connection = new Sequelize(databaseConfig)
    models.map(model => model.init(this.connection))
  }
}

export default Database
