exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE secrets RESTART IDENTITY')
  .then(() => {
    return Promise.all([
      knex.raw(
        'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
        ["I hate mashed potatoes", new Date]
      ),
      knex.raw(
        'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
        ["I love rap music", new Date]
      ),
      knex.raw(
        'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
        ["I hate game shows", new Date]
      )
    ]);
  });
};
