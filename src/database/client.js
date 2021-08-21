const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('scaffold', 'postgres', 'secret', {
  host: 'postgres',
  port: '5432',
  dialect: 'postgres'
})

module.exports = { client: sequelize }
