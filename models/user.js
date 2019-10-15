const Redis = require('ioredis')
const redis = new Redis()

module.exports = {
  get: async(userId) => {
  
   const result = await redis.hgetall(`user:${userId}`)
   return result 
  
   
  },

  count: async() => { 
    return await redis.scard('users')  
  },

  getAll: async(limit, offset) => {
    let users = []
    const keys = await redis.smembers("users")
    for (let index = 0; index < keys.length; index++) {
      const user = await redis.hgetall(`user:${keys[index]}`)
      user['rowid'] = keys[index]
      users.push(user)
    }
    return users

},

  insert: async(params) => {
    const pipeline = redis.pipeline()
    const userId = require('uuid').v4()
    
    pipeline.sadd('users',userId)
    pipeline.hmset(`user:${userId}`, {
        id: params.id,
        pseudo: params.pseudo,
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        password: params.password})

    // pipeline.sadd('users', userId)

    return await pipeline.exec()

  },

  update: async(userId, params) => {
    const pipeline = redis.pipeline()
    
    pipeline.hmset(`user:${userId}`, {
        id: userId,
        pseudo: params.pseudo,
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        password: params.password})

    // pipeline.sadd('users', userId)

    return await pipeline.exec()

  },

  remove: async(userId) => {
    const pipeline = redis.pipeline()

    pipeline.srem('users',userId)
    pipeline.del(`user:${userId}`)
    return await pipeline.exec()
  
}
}
