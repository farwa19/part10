const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()

const connectToDatabase = require('./db')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000


const main = async () => {
  try {
    await connectToDatabase(MONGODB_URI)
    startServer(PORT)
  } catch (error) {
    console.error('Failed to start server:', error)
  }
}


main()