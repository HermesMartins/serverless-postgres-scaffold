const { client } = require('../../../database/client')
const User = require('../model/user')
const httpErrorHandler = require('@middy/http-error-handler')
const middy = require('@middy/core')
const httpResponseSerializer = require('@middy/http-response-serializer')
const httpEventNormalizer = require('@middy/http-event-normalizer')

const handler = middy(
  async (event, context) => {
    try {
      await client.authenticate()

      const { pathParameters: { userId } } = event

      const data = await User.destroy({
        where: { id: parseInt(userId) }
      })

      await client.close()

      if (!data) {
        return {
          statusCode: 204
        }
      }

      return { body: {} }
    } catch (error) {
      console.error('Error: ', error)
      throw error
    }
  }
)

handler
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
