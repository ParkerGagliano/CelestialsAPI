'use strict';

const { Model } = require('objection');

class Streamers extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'streamers';
  }
}

module.exports = {
    Streamers,
};