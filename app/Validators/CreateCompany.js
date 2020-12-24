'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateCompany {
  get rules() {
      return {
          email: 'required|email|max:150',
          name: 'required',
          state: 'required',
          city: 'required',
          zip: 'required',
          phone: 'required',
          contact_id: 'required|integer',
          address_line_1: 'required',
          status: 'required|integer',
          owner_id: 'required|integer'
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateCompany
