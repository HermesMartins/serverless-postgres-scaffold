const { client } = require('../../../database/client')
const User = require('../model/user')
const httpErrorHandler = require('@middy/http-error-handler')
const middy = require('@middy/core')
const httpResponseSerializer = require('@middy/http-response-serializer')
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const handler = middy(
  async (event, context) => {
    try {
      await client.authenticate()

      const { pathParameters: { userId }, body } = event

      const toUpdate = {}

      if (body.firstName) {
        toUpdate.firstName = body.firstName
      }

      if (body.lastName) {
        toUpdate.lastName = body.lastName
      }

      if (body.email) {
        toUpdate.email = body.email
      }

      const data = await User.update(toUpdate, {
        where: {
          id: parseInt(userId)
        },
        returning: true
      })

      await client.close()

      if (!data[0]) {
        return { statusCode: 204 }
      }

      return { body: data[1][0] }
    } catch (error) {
      console.error('Error: ', error)
      throw error
    }
  }
)

handler
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
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
