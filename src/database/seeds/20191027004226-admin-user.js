'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@gympoint.com',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('People', null, {})
  },
}
