'use strict'
const { validate, rule, formatters } = use('Validator')

class Register {    
  get rules() {
      return {
          email: 'required|email|max:150|unique:users',
          password: [
              rule("regex", /(?=^.{8,}$)(?=.*[!@#$%^&_*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
              rule("required")
          ],
          public_email: 'email|max:150',
          first_name: 'required|max:120',
          last_name: 'required|max:180',
          state: 'required|max:50',
          city: 'required|max:255',
          address_line1: 'required',
          phone: 'required',
          sex: 'required|string|in:male,female',
          birthdate: 'required|date',
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = Register
