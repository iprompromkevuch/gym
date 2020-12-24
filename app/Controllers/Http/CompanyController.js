'use strict'
const Company = use('App/Models/Company');

class CompanyController {
  /**
  * @swagger
  * /api/v1/company/:
  *   get:
  *     tags:
  *       - Company API
  *     security:
  *          - bearerAuth: []
  *     summary: Get list of companies
  *     parameters:
  *       - name: page
  *         description: Number of the current page (used for pagination)
  *         in: query
  *         required: false
  *         type: string
  *       - name: perPage
  *         description: Number of users, displayed pre page (used for pagination)
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: Collection of companies
  *         example:
  *           response: {
  *           
                    "total": "15",
                    "perPage": 2,
                    "page": 1,
                    "lastPage": 8,
                    "data": [
                        {
                            "id": 1,
                            "name": "Company 1",
                            "state": "WA",
                            "city": "Seattle",
                            "zip": "01110",
                            "phone": "+81558852224",
                            "email": "maila@mail.tst",
                            "contact": "John Doe",
                            "address_line1": "Some Addr",
                            "address_line2": "Line 2",
                            "owner_id": 1,
                            "created_at": "2020-07-29 16:05:05",
                            "updated_at": "2020-07-29 16:05:05",
                            "status": 1,
                            "contact_id": 0
                        },
                        {
                            "id": 2,
                            "name": "Company 2",
                            "state": "OR",
                            "city": "Portland",
                            "zip": "02320",
                            "phone": "+818254562",
                            "email": "company@mail.tst",
                            "contact": "Jane Doe",
                            "address_line1": "Some Adder",
                            "address_line2": "Line 3",
                            "owner_id": 1,
                            "created_at": "2020-07-29 16:05:05",
                            "updated_at": "2020-07-29 16:05:05",
                            "status": 1,
                            "contact_id": 0
                        }
                    ]
                }
  */
    async listCompanies({request, auth, response}) {
        const par = request.only(['page', 'perPage']);
        let quantity = 2147483640;
        let page = 1;
        let statuses = [1];
        if (par.page !== undefined && par.page !== null) {
            page = par.page;
        }
        if (par.perPage !== undefined && par.perPage !== null) {
            quantity = par.perPage;
        }
        if (auth.user.is_admin === true) {
            statuses.push(0);
        }
        let companies = await Company.query()
                .whereIn('status', statuses).paginate(page, quantity);
        return response.json(companies);
    }
    
  /**
  * @swagger
  * /api/v1/company/{id}:
  *   get:
  *     tags:
  *       - Company API
  *     security:
  *          - bearerAuth: []
  *     summary: Get info about specified company
  *     parameters:
  *       - name:  id
  *         description: Company id, must be integer.
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Company info
  *         example:
  *           response: {
                "id": 5,
                "name": "Company 2",
                "state": "OR",
                "city": "Portland",
                "zip": "02320",
                "phone": "+818254562",
                "email": "company@mail.tst",
                "contact": "Jane Doe",
                "address_line1": "Some Adder",
                "address_line2": "Line 3",
                "owner_id": 1,
                "created_at": "2020-09-07 18:07:15",
                "updated_at": "2020-09-07 18:07:15",
                "status": 1,
                "contact_id": 3
            }
  *       404:
  *         description: Company not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  */
    
    async getCompany({params, auth, response}) {
        let statuses = [1];
        if (auth.user.is_admin === true) {
            statuses.push(0);
        }
        let company = await Company.query()
                .where('id', '=', params.id)
                .whereIn('status', statuses).first();
        if(company === null) {
            return response.status(404).json({message: 'Not found'});
        }
        return response.json(company);
    }
    
  /**
  * @swagger
  * /api/v1/company/{id}:
  *   put:
  *     tags:
  *       - Company API
  *     summary: Edit specified company. Note if parameter isn't set this parameter won't be updated
  *     security:
  *          - bearerAuth: []
  *     parameters:
  *       - name:  id
  *         description: Company id, must be integer.
  *         in: path
  *         required: true   
  *       - name: name
  *         description: Company name, must be maximum 255 characters long.
  *         in: query
  *         required: false
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: query
  *         required: false
  *         type: string
  *       - name: city
  *         description: City, maximum 254 characters
  *         in: query
  *         required: false
  *         type: string
  *       - name: zip
  *         description: Zip code. must be at maximum 50 characters long.
  *         in: query
  *         required: false
  *         type: string
  *       - name: email
  *         description: Public email. must be email, if set. Maximum 150 characters long
  *         in: query
  *         required: false
  *         type: email
  *       - name: phone
  *         description: Company's phone number. Must not more than 70 characters long
  *         in: query
  *         required: false
  *         type: string
  *       - name: address_line_1
  *         description: Addres line 1, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: address_line_2
  *         description: Addres line 2, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: owner_id
  *         description: ID of user, who owns this company. Only admin can edit this field
  *         in: query
  *         required: false
  *         type: string
  *       - name: status
  *         description: Status. Only admin can edit this field
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: Company created successfully
  *         example:
  *           response: {
                  "name": "Horns and hoofs",
                  "email": "aaa@bbb.cc",
                  "state": "OR",
                  "city": "Portland",
                  "zip": "01010101",
                  "phone": "123456789",
                  "contact_id": "2",
                  "address_line1": "Some addr",
                  "address_line2": "rrrr",
                  "status": "1",
                  "created_at": "2020-09-10 20:12:46",
                  "updated_at": "2020-09-10 20:12:46",
                  "id": 16
          }
  *       422:
  *         description: Validation failed
  *         example:
  *           response: {
            "errors": [
                {
                    "title": "email",
                    "detail": "email validation failed on email",
                    "source": {
                        "pointer": "email"
                    }
                }
            ]
        }
  *       403:
  *         description: If non admin wants to edit owner of status
  *         example:
  *           response: {"message": "Only admin can edit owner"}
  */
    
    async editCompany({params, request, auth, response}) {
        let company = await Company.query()
                .where('id', '=', params.id)
                .where('status', '<>', 0).first();
        if(company === null) {
            return response.status(404).json({message: 'Not found'});
        }
        if(company.owner_id !== auth.user.id && auth.user.is_admin !== true) {
            let allow = await company.canEdit(auth.user.id);
            if(!allow) {
                return response.status(403).json({message: 'Forbidden'});
            }
        }
        const data = request.only(['name', 'state', 'city', 'zip', 'phone', 'email', 
            'contact_id', 'address_line_1', 'address_line_2', 'status', 'owner_id']);
        if(data.status !== undefined && data.status !== null && auth.user.is_admin !== true) {
            return response.status(403).json({message: 'Only admin can edit status'});
        }
        if(data.owner_id !== undefined && data.owner_id !== null && auth.user.is_admin !== true) {
            return response.status(403).json({message: 'Only admin can edit owner'});
        }
        if(data.name !== undefined && data.name !== null) {
            company.name = data.name;
        }
        if(data.state !== undefined && data.state !== null) {
            company.state = data.state;
        }
        if(data.city !== undefined && data.city !== null) {
            company.city = data.city;
        }
        if(data.zip !== undefined && data.zip !== null) {
            company.zip = data.zip;
        }
        if(data.email !== undefined && data.email !== null) {
            company.email = data.email;
        }
        if(data.phone !== undefined && data.phone !== null) {
            company.phone = data.phone;
        }
        if(data.contact_id !== undefined && data.contact_id !== null) {
            company.contact_id = data.contact_id;
        }
        if(data.address_line_1 !== undefined && data.address_line_1 !== null) {
            company.address_line1 = data.address_line_1;
        }
        if(data.address_line_2 !== undefined && data.address_line_2 !== null) {
            company.address_line2 = data.address_line_2;
        }
        if(data.status !== undefined && data.status !== null) {
            company.status = data.status;
        }
        await company.save();
        return response.json({message: 'Done'});
    }
    
  /**
  * @swagger
  * /api/v1/company:
  *   post:
  *     tags:
  *       - Company API
  *     summary: Create new company Only admin can create company
  *     security:
  *          - bearerAuth: []
  *     parameters:
  *       - name: name
  *         description: Company name, must be maximum 255 characters long.
  *         in: query
  *         required: true
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: query
  *         required: true
  *         type: string
  *       - name: city
  *         description: City, maximum 254 characters
  *         in: query
  *         required: true
  *         type: string
  *       - name: zip
  *         description: Zip code. must be at maximum 50 characters long.
  *         in: query
  *         required: true
  *         type: string
  *       - name: email
  *         description: Public email. must be email, if set. Maximum 150 characters long
  *         in: query
  *         required: false
  *         type: email
  *       - name: phone
  *         description: Company's phone number. Must not more than 70 characters long
  *         in: query
  *         required: true
  *         type: string
  *       - name: address_line_1
  *         description: Addres line 1, no limits
  *         in: query
  *         required: true
  *         type: string
  *       - name: address_line_2
  *         description: Addres line 2, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: owner_id
  *         description: ID of user, who owns this company
  *         in: query
  *         required: true
  *         type: string
  *       - name: status
  *         description: Status
  *         in: query
  *         required: true
  *         type: string
  *       - name: contact_id
  *         description: Contact ID
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Company edited successfully
  *         example:
  *           response: {
                  "name": "Horns and hoofs",
                  "email": "aaa@bbb.cc",
                  "state": "OR",
                  "city": "Portland",
                  "zip": "01010101",
                  "phone": "123456789",
                  "contact_id": "2",
                  "address_line1": "Some addr",
                  "address_line2": "rrrr",
                  "status": "1",
                  "created_at": "2020-09-10 20:12:46",
                  "updated_at": "2020-09-10 20:12:46",
                  "id": 16
          }
  *       422:
  *         description: Validation failed
  *         example:
  *           response: {
            "errors": [
                {
                    "title": "email",
                    "detail": "email validation failed on email",
                    "source": {
                        "pointer": "email"
                    }
                }
            ]
        }
  *       403:
  *         description: Request is run by non-admin
  *         example:
  *           response: {"message": "Forbidden"}
  */
    async createCompany({request, auth, response}) {
        if(auth.user.is_admin !== true) {
            return response.status(403).json({message: 'Forbidden'});
        }
        const data = request.only(['name', 'state', 'city', 'zip', 'phone', 'email', 
            'contact_id', 'address_line_1', 'address_line_2', 'status', 'owner_id']);
        if (data.address_line_2 === undefined) {
            data.address_line_2 = null;
        }
        let compData = {
            name:data.name,
            email: data.email,
            state: data.state,
            city: data.city,
            zip: data.zip,
            phone: data.phone,
            contact_id: data.contact_id,
            address_line1: data.address_line_1,
            address_line2: data.address_line_2,
            status: data.status,
            owner_id: data.owner_id
        }
        let company = await Company.create(compData);
        return response.json(company);
    }
}

module.exports = CompanyController
