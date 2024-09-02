module.exports = {
  async up(db, client) {
    db.createCollection('users')
  },

  async down(db) {
    return db.collection('users').drop()
  },
}
