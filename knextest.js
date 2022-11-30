// run the following command to install:
// npm install objection knex sqlite3

const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'example.db'
  }
});

// Give the knex instance to objection.
Model.knex(knex);


async function createSchema() {
  if (await knex.schema.hasTable('wowplayers')) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable('wowplayers', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('tagline');
    table.string('rank');
    table.string('twitter');
    table.string('youtube');
    table.string('twitch');
    table.string('tiktok');
  });

  const kyle = await wowplayers.query().insertGraph({
    name: 'Kyle',
  });
}

function main() {
  createSchema()
}


module.exports = main;