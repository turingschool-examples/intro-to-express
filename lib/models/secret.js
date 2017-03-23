const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

function clearSecrets(){
  return database.raw('TRUNCATE secrets RESTART IDENTITY');
}

function createSecret(message){
  return database.raw(
    'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
    [message, new Date]
  )
}

function findSecretByMessage(message){
  return database.raw("select * from secrets where message=?", [message])
}

function find(id){
  return database.raw("SELECT * FROM secrets WHERE id=?", [id])
}

module.exports = {
  clearSecrets: clearSecrets,
  createSecret: createSecret,
  findSecretByMessage: findSecretByMessage,
  find: find
}
