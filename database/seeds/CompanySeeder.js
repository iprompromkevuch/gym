'use strict'
const Company = use('App/Models/Company');

/*
|--------------------------------------------------------------------------
| CompanySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CompanySeeder {
  async run () {
      await Company.create({
        name: 'Company 1',
        state: 'WA',
        city: 'Seattle',
        zip: '01110',
        phone: '+81558852224',
        email: 'maila@mail.tst',
        contact: 'John Doe',
        address_line1: 'Some Addr',
        address_line2: 'Line 2',
        owner_id: 1
      });
      
      await Company.create({
        name: 'Company 2',
        state: 'OR',
        city: 'Portland',
        zip: '02320',
        phone: '+818254562',
        email: 'company@mail.tst',
        contact: 'Jane Doe',
        address_line1: 'Some Adder',
        address_line2: 'Line 3',
        owner_id: 1
      });
      
      await Company.create({
        name: 'Company 3',
        state: 'TX',
        city: 'Dallas',
        zip: '0870',
        phone: '+852145645',
        email: 'somename@noentity.aq',
        contact: 'Some Name',
        address_line1: 'Some Street',
        address_line2: 'Dmm',
        owner_id: 2
      });
  }
}

module.exports = CompanySeeder
