'use strict';

const { Model } = require('objection');

class Wowplayers extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'wowplayers';
  }
}

module.exports = {
  Wowplayers,
};