const { client } = require('../../../database/client')
const User = require('../model/user')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const middy = require('@middy/core')
const httpResponseSerializer = require('@middy/http-response-serializer')
const validator = require('@middy/validator')

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 3, maxLength: 20 },
        lastName: { type: 'string', minLength: 3, maxLength: 20 },
        email: { type: 'string', format: 'email' }
      },
      required: ['firstName', 'lastName', 'email']
    }
  }
}

const handler = middy(
  async (event, context) => {
    try {
      await client.authenticate()

      const { body } = event

      await User.sync({ force: true }) // TODO deletar

      const data = await User.create(body)

      await client.close()

      return { body: data }
    } catch (error) {
      console.error('Error: ', error)
      throw error
    }
  }
)

handler
  .use(httpJsonBodyParser())
  .use(validator({ inputSchema }))
  .use(httpResponseSerializer({
    serializers: [
      {
        regex: /^application\/json$/,
        serializer: ({ body }) => JSON.stringify(body)
      }
    ],
    default: 'application/json'
  }))
  .use(httpErrorHandler())

module.exports = { handler }
