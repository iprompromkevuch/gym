'use strict'
const { validate, rule, formatters } = use('Validator');

class EditCompany {
    get rules() {
      return {
          email: 'email|max:150',
          name: 'string|min:1|max:254',
          state: 'min:2|max:50',
          city: 'min:1|max:254',
          zip: 'min:1|max:254',
          phone: 'min:1|max:254',
          contact_id: 'integer',
          address_line_1: 'min:1',
          status: 'integer',
          owner_id: 'integer'
      }
    }
  
    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }
  
    get formatter () {
      return formatters.JsonApi
    }
}

module.exports = EditCompany
