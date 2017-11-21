/*
 * sample.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}


function findAll() {
  return db.selectAll('SELECT * FROM samples')
}

function findById(id) {
  return db.selectOne('SELECT * FROM samples WHERE id = @id', { id })
}

function update(sample) {
  return db.query(`
    UPDATE samples
       SET name     = @name
         , tags     = @tags
         , steps    = @steps
         , modified = now()
     WHERE id = @id`, sample)
}

function create(sample) {
  return db.query(`
    INSERT INTO samples (name, template_id, tags, steps, created)
        VALUES( @name
              , @templateId
              , @tags
              , @steps
              , now()
              )
  `, sample)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM samples WHERE id = @id', { id })
}
