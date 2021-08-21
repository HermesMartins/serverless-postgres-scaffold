const { DataTypes, Model } = require('sequelize')
const { client } = require('../../../database/client')

class User extends Model {}

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
    // allowNull defaults to true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  // Other model options go here
  sequelize: client, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
})

module.exports = User
