import Sequelize from 'sequelize'
import databaseConfig from '../config/database'
import mongoose from 'mongoose'

// Models
import Users from '../app/models/Users'
import Students from '../app/models/Students'
import Plans from '../app/models/Plans'

const models = [Users, Students, Plans]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models.map(model => model.init(this.connection))
  }

  mongo() {
    mongoose.connect('mongodb://localhost:27017/gympoint', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  }
}

export default new Database()
