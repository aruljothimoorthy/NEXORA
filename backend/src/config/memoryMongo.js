/**
 * Development helper: spin up an ephemeral MongoDB when Atlas/local is unavailable.
 * Enable with USE_MEMORY_MONGO=true in backend/.env
 */
const startMemoryMongo = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri('nexora')
  console.log('In-memory MongoDB started for development')
  return { uri, mongod }
}

module.exports = startMemoryMongo
