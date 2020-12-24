'use strict'
const { validate, rule, formatters } = use('Validator')

class StoreImage {
   get rules() {
      return {
         image: 'required'
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = StoreImage
