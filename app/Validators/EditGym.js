'use strict'
const { validate, rule, formatters } = use('Validator');

class EditGym {
  get rules () {
    return {
      name: 'max:200',
      phone: 'max:20',
      email: 'email|max:150',
      city: 'max:255',
      state: 'max:50',
      zip: 'max:254',
      company_id: 'integer',
      status: 'integer'
    }
  }
  
  async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
      return formatters.JsonApi
  }
}

module.exports = EditGym
