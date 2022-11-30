'use strict';

const { Model } = require('objection');

class wowplayers extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'wowplayers';
  }
}

module.exports = {
    wowplayers,
};