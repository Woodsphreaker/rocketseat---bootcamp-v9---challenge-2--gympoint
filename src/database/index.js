import Sequelize from 'sequelize'
import databaseConfig from '../config/database'
import mongoose from 'mongoose'

// Models
import Users from '../app/models/Users'
import Students from '../app/models/Students'
import Plans from '../app/models/Plans'
import Registrations from '../app/models/Registrations'
import Checkins from '../app/models/Checkins'
import HelpOrders from '../app/models/HelpOrders'

const models = [Users, Students, Plans, Registrations, Checkins, HelpOrders]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
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
