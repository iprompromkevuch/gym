'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Image extends Model {
  static get table () {
    return 'client_images';
  }
}

module.exports = Image
