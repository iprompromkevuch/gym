'use strict'
const User = use('App/Models/User');
const Roles = use('App/Models/Role');
const Database = use('Database');
const Helpers = use('Helpers');
const moment = require("moment");
const pagination = use('App/Utils/pagination');

const CreateClient = use('App/Services/User/CreateClient');

class UserController {
    async createClient({request, auth, response}) {
        const useCase = new CreateClient();
        return useCase.execute(request, auth, response);
    }

  /**
  * @swagger
  * /api/v1/user:
  *   post:
  *     tags:
  *       - User API
  *     summary: Register new user
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: email
  *         description: User's email. Must be email, must be unique, must not be more than 150 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: password
  *         description: User's password. must be at least 8 characters, must contain at least 1 capital letter and 1 special character
  *         in: formData
  *         required: true
  *         type: string
  *       - name: public_email
  *         description: Public email. must be email, if set. Maximum 150 characters long
  *         in: formData
  *         required: false
  *         type: string
  *       - name: first_name
  *         description: First name. Maximum 120 characters long
  *         in: formData
  *         required: true
  *         type: string
  *       - name: last_name
  *         description: Last name name. Maximum 120 characters long
  *         in: formData
  *         required: true
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: city
  *         description: City, maximum 255 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: address_line1
  *         description: Addres line 1, no limits
  *         in: formData
  *         required: true
  *         type: string
  *       - name: address_line2
  *         description: Addres line 2, no limits
  *         in: formData
  *         required: false
  *         type: string
  *       - name: phone
  *         description: User's phone number
  *         in: formData
  *         required: true
  *         type: string
  *       - name: sex
  *         description: one of male, female (case sensitive)
  *         in: formData
  *         required: true
  *         type: string
  *       - name: birthdate
  *         description: Date of birth, must be in format mm-dd-yyyy
  *         in: formData
  *         required: true
  *         type: string
  *       - name: profile_image
  *         description: User's avatar
  *         in: formData
  *         required: false
  *         type: file
  *     responses:
  *       200:
  *         description: Register Ok
  *         example: {
                "email": "163@gmail.com",
                "first_name": "213",
                "last_name": "123",
                "state": "123",
                "city": "123",
                "address_line1": "123",
                "address_line2": "123",
                "phone": "123",
                "sex": "male",
                "id": 11,
                "birthdate": "2000-10-10",
                "profile_img_url": "11/1.jpeg",
                "type": "bearer",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjExLCJpYXQiOjE2MDc1OTgzNTV9.l_-DDoMIgQ3dh8DkrtOOQSniLgeagCti91zB0Tv6GzI",
                "refreshToken": null
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
  */
   async register({request, auth, response}) {
    try {
        const params = request.only(['email', 'password']);
        const input = request.only(['email', 'password', 'public_email', 'first_name', 'last_name', 'state',
          'city', 'address_line1', 'address_line2', 'phone', 'sex',
          'profile_img', 'bio', 'additional_info', 'preferred_gym_locations']);
        let user = await User.create(input);
        let token = await auth.generate(user);
        const birthdate = request.only(['birthdate']);
        user.birthdate = moment(birthdate.birthdate, "MM-DD-YYYY").format('YYYY-MM-DD');
        const profilePic = request.file('profile_image', {
            types: ['image'],
            size: '2mb'
          });
        
        if(profilePic != null) {
            await profilePic.move(Helpers.tmpPath(`uploads/user/${user.id}`), {
              name: `${profilePic.clientName}`,
              overwrite: true
            });
            if (!profilePic.moved()) {
              user.profile_img_url = null;
            }
            else {
                user.profile_img_url = `${user.id}/${profilePic.clientName}`;
            }
        }
        await user.save();
        Object.assign(user, token);
        return response.json(user);
    }
    catch(err) {
        console.log(err);
        response.status(500).json({ error : err })
    } 
  }
  
  
    /**
  * @swagger
  * /api/v1/login:
  *   post:
  *     tags:
  *       - User API
  *     summary: Login user
  *     parameters:
  *       - name: email
  *         description: User's email. Must be email
  *         in: formData
  *         required: true
  *       - name: password
  *         description: User's password.
  *         in: formData
  *         required: true
  *     responses:
  *       200:
  *         description: Login Ok
  *         example:
  *           response: {
                    "user": {
                        "id": 4,
                        "email": "mail@mrt.ipq",
                        "first_name": "Name",
                        "last_name": "Lastname",
                        "state": "WA",
                        "city": "Seattle",
                        "address_line1": "Addres line 1",
                        "address_line2": "Addres line 2",
                        "phone": "+35814566",
                        "sex": "male",
                        "birthdate": "1981-04-14T20:00:00.000Z",
                        "profile_img_url": "/uploads/user/4",
                        "bio": "Lorem ipsum",
                        "preferred_gym_locations": null,
                        "public_email": "public@pbl.sx",
                        "additional_info": "Another Lorem ipsum",
                        "type": "bearer",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQsImlhdCI6MTYwNjMwNDEwNH0.KW3fHe4nxT5yRiAnxIImjOJWJSa7BQvUIjc4oQYMF4g",
                        "refreshToken": null
                    },
                    "roles": [
                        {
                            "id": 23,
                            "user_id": 4,
                            "role_id": 1,
                            "company_id": 5,
                            "name": "client"
                        },
                        {
                            "id": 22,
                            "user_id": 4,
                            "role_id": 1,
                            "company_id": 2,
                            "name": "client"
                        },
                        {
                            "id": 15,
                            "user_id": 4,
                            "role_id": 3,
                            "company_id": 2,
                            "name": "owner"
                        },
                        {
                            "id": 14,
                            "user_id": 4,
                            "role_id": 3,
                            "company_id": 1,
                            "name": "owner"
                        },
                        {
                            "id": 20,
                            "user_id": 4,
                            "role_id": 4,
                            "company_id": 5,
                            "name": "manager"
                        },
                        {
                            "id": 13,
                            "user_id": 4,
                            "role_id": 4,
                            "company_id": 1,
                            "name": "manager"
                        },
                        {
                            "id": 19,
                            "user_id": 4,
                            "role_id": 5,
                            "company_id": 5,
                            "name": "sales agent"
                        }
                    ]
                }
  *       401:
  *         description: Unautorized user
  *         example:
  *           response: {
                 "message": "Unauthorized"
            }
  */
  async login({request, auth, response}) {
    const params = request.only(['email', 'password']);

    try {
      if (await auth.attempt(params.email, params.password)) {
        let user = await User.findBy('email', params.email);
        let token = await auth.generate(user);
        let roles = await user.getRolesWithCompanies();

        let uoutput = Object.assign(user, token);
        return response.json({user: uoutput, roles: roles})
      }
    } catch (e) {
      return response.status(401).json({message: 'Unauthorized'})
    }
  }
  
 
 /**
  * @swagger
  * /api/v1/user/assign_role/{id}:
  *   put:
  *     tags:
  *       - User API
  *     security:
  *          - bearerAuth: []
  *     summary: Assign role to user. Must be improved after requirements clarification. Now any user can assign any role in any company to everyone (Temporary desifion). You must pass role ID in url 1 - Client, 2 - Trainer, 3 - Owner, 4 - Manager, 5 - Sales agent
  *     parameters:
  *       - name:  id
  *         description: Role id, must be integer,please read summary to clarify possible values
  *         in: path
  *         required: true
  *       - name: company_id
  *         description: ID of the company for creating groups of values User - Company - Role. 
  *         in: query
  *         required: true
  *     responses:
  *       200:
  *         description: Login successful
  *         example:
  *           response: {
                  "user": {
                    "id": 8,
                    "email": "sgt@jjj.iii",
                    "password": "$2a$10$FOZHT6oqWIFwLKXGdBIDoudsc5QjtTeq8SUoHmFy3k40faK7Xj/KS",
                    "first_name": null,
                    "last_name": null,
                    "state": null,
                    "city": null,
                    "address_line1": null,
                    "address_line2": null,
                    "phone": null,
                    "sex": null,
                    "birthdate": null,
                    "profile_img_url": null,
                    "bio": null,
                    "created_at": "2020-07-30 12:04:37",
                    "updated_at": "2020-07-30 12:04:37",
                    "preferred_gym_locations": null,
                    "public_email": null,
                    "additional_info": null,
                    "is_admin": false
                },
                "roles": [
                    {
                        "id": 21,
                        "user_id": 8,
                        "role_id": 1,
                        "company_id": 3,
                        "name": "client"
                    },
                    {
                        "id": 18,
                        "user_id": 8,
                        "role_id": 1,
                        "company_id": 2,
                        "name": "client"
                    },
                    {
                        "id": 16,
                        "user_id": 8,
                        "role_id": 4,
                        "company_id": 1,
                        "name": "manager"
                    },
                    {
                        "id": 17,
                        "user_id": 8,
                        "role_id": 4,
                        "company_id": 2,
                        "name": "manager"
                    }
                ]
          }
  *       401:
  *         description: Wrong username and/or password
  *         example:
  *           response: {
                 "message": "Unauthorized"
            }
  */
  async assignRole({params, request, auth, response}) {
      let user = auth.user;
      const company = request.only(['company_id']);
      let current = await user.roles().where('company_id', '=', company.company_id)
              .where('role_id', '=', params.id).count();
      //return response.json({a: current[0].count});
      if(parseInt(current[0].count) < 1) {
          await Database.table('user_role_relations').insert({
              user_id: user.id,
              role_id: params.id,
              company_id: company.company_id
          });
      }
      const roles = await user.getRolesWithCompanies();
      return response.json({user: user, roles: roles});
  }
  
  /**
  * @swagger
  * /api/v1/user/me:
  *   get:
  *     tags:
  *       - User API
  *     security:
  *          - bearerAuth: []
  *     summary: Get info about current user
  *     responses:
  *       200:
  *         description: Userinfo
  *         example:
  *           response: {
                "user": {
                    "id": 3,
                    "email": "mail@mrt.ipqe",
                    "password": "$2a$10$OvfHD4Felp7Bj0.lQyA9euUOuJSih/JVZXglR/zoFv4Lw0xe7QcdK",
                    "first_name": "Name",
                    "last_name": "Lastname",
                    "state": "WA",
                    "city": "Seattle",
                    "address_line1": "Addres line 1",
                    "address_line2": "Addres line 2",
                    "phone": "+35814566",
                    "sex": "male",
                    "birthdate": "1981-04-15T00:00:00.000Z",
                    "profile_img_url": "/uploads/user/3",
                    "bio": "Lorem ipsum",
                    "additional_info": "Another Lorem ipsum",
                    "created_at": "2020-07-30 15:55:16",
                    "updated_at": "2020-08-23 18:33:01",
                    "preferred_gym_locations": "Loc1, Loc2",
                    "public_email": "public@pbl.sx"
                },
                "roles": [
                    {
                        "id": 3,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 1,
                        "name": "client"
                    },
                    {
                        "id": 2,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 2,
                        "name": "client"
                    },
                    {
                        "id": 1,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 3,
                        "name": "client"
                    }
                ]
            }
  */
  
  async me({request, auth, response}) {
      let user = auth.user;
      let roles = await user.getRolesWithCompanies();
      return response.json({user: user, roles: roles});
  }
  
  /**
  * @swagger
  * /api/v1/user/:
  *   get:
  *     tags:
  *       - User API
  *     security:
  *          - bearerAuth: []
  *     summary: Get list of users
  *     parameters:
  *       - name: filter
  *         description: Filter by user type. Possible values - clients', 'trainers', 'staff', 'non-trainers'
  *         in: query
  *         required: false
  *         type: string
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
  *         description: Collection of users
  *         example:
  *           response: {
                "data": [{
                    "id": 3,
                    "email": "mail@mrt.ipqe",
                    "password": "$2a$10$OvfHD4Felp7Bj0.lQyA9euUOuJSih/JVZXglR/zoFv4Lw0xe7QcdK",
                    "first_name": "Name",
                    "last_name": "Lastname",
                    "state": "WA",
                    "city": "Seattle",
                    "address_line1": "Addres line 1",
                    "address_line2": "Addres line 2",
                    "phone": "+35814566",
                    "sex": "male",
                    "birthdate": "1981-04-15T00:00:00.000Z",
                    "profile_img_url": "/uploads/user/3",
                    "bio": "Lorem ipsum",
                    "additional_info": "Another Lorem ipsum",
                    "created_at": "2020-07-30 15:55:16",
                    "updated_at": "2020-08-23 18:33:01",
                    "preferred_gym_locations": "Loc1, Loc2",
                    "public_email": "public@pbl.sx"
                }, {
                    "id": 4,
                    "email": "mail@mrt.ipqe",
                    "password": "$2a$10$OvfHD4Felp7Bj0.lQyA9euUOuJSih/JVZXglR/zoFv4Lw0xe7QcdK",
                    "first_name": "Name",
                    "last_name": "Lastname",
                    "state": "WA",
                    "city": "Seattle",
                    "address_line1": "Addres line 1",
                    "address_line2": "Addres line 2",
                    "phone": "+35814566",
                    "sex": "male",
                    "birthdate": "1981-04-15T00:00:00.000Z",
                    "profile_img_url": "/uploads/user/3",
                    "bio": "Lorem ipsum",
                    "additional_info": "Another Lorem ipsum",
                    "created_at": "2020-07-30 15:55:16",
                    "updated_at": "2020-08-23 18:33:01",
                    "preferred_gym_locations": "Loc1, Loc2",
                    "public_email": "public@pbl.sx"
                }],
                "paginatation": {
                    "total": 1,
                    "perPage": 10,
                    "page": 1,
                    "lastPage": 1
                }
            }
  */
  async listUsers({params, request, auth, response}) {
      let quantity = 2147483640;
      let page = 1;
      let filter = null;
      let filterType = '=';
      const par = request.only(['filter', 'page', 'perPage']);
      if(par.filter === 'clients') {
          filter = 1;
      }
      else if(par.filter === 'trainers') {
          filter = 2;
      }
      else if(par.filter === 'staff') {
          filter = 1;
          filterType = '<>';
      }
      else if(par.filter === 'non-trainers') {
          filter = 1;
          filterType = '<>';
      }
      if (par.page !== undefined && par.page !== null) {
            page = par.page;
      }
      if (par.perPage !== undefined && par.perPage !== null) {
            quantity = par.perPage;
      }
      const orderation = ['users.id', 'users.email', 'users.first_name', 'users.last_name', 'users.state', 'users.city']; //may be not needed?
      let staff = await Database.select('*')
              .from('user_role_relations')
              .whereNot('role_id', '=', 1)
              .where('user_id', '=', auth.user.id);
      let companies = [];
      staff.forEach(function(element) {
          if(companies.indexOf(element.company_id) === -1) {
                  companies.push(element.company_id);
          }
      });
      let client = await Database
              .from('user_role_relations')
              .where('role_id', '=', 1)
              .where('user_id', '=', auth.user.id).count();
      let usersIds = [];
      if(companies.length > 0) {
         usersIds = await Database.select('user_id')
              .from('user_role_relations')
              .where(function() {
                      this.whereIn('company_id', companies)
                      if(filter !== null) {
                          this.where('role_id', filterType, filter)
                          if(par.filter === 'non-trainers') {
                              this.whereNot('role_id', '=', 2)
                          }
                      }
                      if(client[0].count > 0) {
                        if(filter === null || filter === 2) {
                            this.orWhere('role_id', '=', 2)
                        }
                      }
              })
        }
        else if (client[0].count > 0 && companies.length === 0) {
            if(filter === null || par.filter === 'trainers' || par.filter === 'staff') {
                usersIds = await Database
                        .from('user_role_relations')
                        .select('user_id').where('role_id', '=', 2);
            }  
        }
        let idArr = [];
        usersIds.forEach(function(element) {
            if(idArr.indexOf(element.user_id) === -1) {
                idArr.push(element.user_id);
            }
        });
        if(filter === null && idArr.indexOf(auth.user.id) === -1) {
        	idArr.push(auth.user.id);
        }
        else if(client[0].count > 0 && par.filter === 'clients') {
            idArr.push(auth.user.id);
        }
        let users = await User.query().whereIn('id', idArr).paginate(page, quantity);

        return response.json({
            data: users.rows ? users.rows : [],
            paginatation: pagination(users, quantity, page)
        });
  }
  
  /**
  * @swagger
  * /api/v1/user/{id}:
  *   get:
  *     tags:
  *       - User API
  *     security:
  *          - bearerAuth: []
  *     summary: Get info about specified user
  *     parameters:
  *       - name:  id
  *         description: User id, must be integer,please read summary to clarify possible values
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Userinfo
  *         example:
  *           response: {
                "user": {
                    "id": 3,
                    "email": "mail@mrt.ipqe",
                    "password": "$2a$10$OvfHD4Felp7Bj0.lQyA9euUOuJSih/JVZXglR/zoFv4Lw0xe7QcdK",
                    "first_name": "Name",
                    "last_name": "Lastname",
                    "state": "WA",
                    "city": "Seattle",
                    "address_line1": "Addres line 1",
                    "address_line2": "Addres line 2",
                    "phone": "+35814566",
                    "sex": "male",
                    "birthdate": "1981-04-15T00:00:00.000Z",
                    "profile_img_url": "/uploads/user/3",
                    "bio": "Lorem ipsum",
                    "additional_info": "Another Lorem ipsum",
                    "created_at": "2020-07-30 15:55:16",
                    "updated_at": "2020-08-23 18:33:01",
                    "preferred_gym_locations": "Loc1, Loc2",
                    "public_email": "public@pbl.sx"
                },
                "roles": [
                    {
                        "id": 3,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 1,
                        "name": "client"
                    },
                    {
                        "id": 2,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 2,
                        "name": "client"
                    },
                    {
                        "id": 1,
                        "user_id": 3,
                        "role_id": 1,
                        "company_id": 3,
                        "name": "client"
                    }
                ]
            }
  *       404:
  *         description: User not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  */
  async viewUser({params, auth, response}) {
      let staff = await Database.select('*')
              .from('user_role_relations')
              .whereNot('role_id', '=', 1)
              .where('user_id', '=', auth.user.id);
      let companies = [];
      staff.forEach(function(element) {
          if(companies.indexOf(element.company_id) === -1) {
                  companies.push(element.company_id);
          }
      });
      let user =  await Database.select('*')
              .from('user_role_relations')
              .leftJoin('users', 'user_role_relations.user_id', 'users.id')
              .whereIn('user_role_relations.company_id', companies)
              .where('user_role_relations.user_id', '=', params.id).first();
      if(user === undefined || user.id === undefined) {
          return response.status(404).json({message: 'Not Found'});
      }
      return response.json(user);
  }
  
  /**
  * @swagger
  * /api/v1/user/{id}:
  *   put:
  *     tags:
  *       - User API
  *     summary: Edit user. Note if parameter isn't set this parameter won't be updated
  *     security:
  *          - bearerAuth: []
  *     parameters:
  *       - name:  id
  *         description: User id, must be integer.
  *         in: path
  *         required: true
  *         type: string
  *       - name: email
  *         description: User's email. Must be email, must be unique, must not be more than 150 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: password
  *         description: User's password. must be at least 8 characters, must contain at least 1 capital letter and 1 special character
  *         in: formData
  *         required: true
  *         type: string
  *       - name: public_email
  *         description: Public email. must be email, if set. Maximum 150 characters long
  *         in: formData
  *         required: false
  *         type: string
  *       - name: first_name
  *         description: First name. Maximum 120 characters long
  *         in: formData
  *         required: true
  *         type: string
  *       - name: last_name
  *         description: Last name name. Maximum 120 characters long
  *         in: formData
  *         required: true
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: city
  *         description: City, maximum 255 characters
  *         in: formData
  *         required: true
  *         type: string
  *       - name: address_line1
  *         description: Addres line 1, no limits
  *         in: formData
  *         required: true
  *         type: string
  *       - name: address_line2
  *         description: Addres line 2, no limits
  *         in: formData
  *         required: false
  *         type: string
  *       - name: phone
  *         description: User's phone number
  *         in: formData
  *         required: true
  *         type: string
  *       - name: sex
  *         description: one of male, female (case sensitive)
  *         in: formData
  *         required: true
  *         type: string
  *       - name: birthdate
  *         description: Date of birth, must be in format mm-dd-yyyy
  *         in: formData
  *         required: true
  *         type: string
  *       - name: profile_image
  *         description: User's avatar, must have mime type image
  *         in: formData
  *         required: false
  *         type: file
  *       - name: bio
  *         description: User's biography
  *         in: formData
  *         required: false
  *         type: string
  *       - name: additional_info
  *         description: Field for additional info, no character limits
  *         in: formData
  *         required: false
  *         type: string
  *       - name: preferred_gym_locations
  *         description: Field without character limits
  *         in: formData
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: Edot user Ok
  *         example:
  *           response: {
                "message": "Done"
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
 *         description: Restricted to edit this user
 *         example:
 *           response: {
                "message": "Not Allowed" 
             }
 *       404:
 *         description: User not found
 *         example:
 *           response: {
                "message": "Not Found" 
             }
  */
  async editUser({params, request, auth, response}) {
      let user = await User.find(params.id); 
      if(user === null) {
          return response.status(404).json({message: 'Not Found'});
      }
      if(user.id !== auth.user.id) {
          let allowed = 'n';
          let myRoles = await Database
                .select('*')
                .from('user_role_relations')
                .leftJoin('roles', 'user_role_relations.role_id', 'roles.id')
                .where('user_role_relations.user_id', '=', auth.user.id)
                .where('roles.weight',  '>', 0)
                .orderBy('roles.weight', 'desc');
          let allowedCompanies = [];
          let newComp = {};
          myRoles.forEach(function(element) {
              if(allowedCompanies.indexOf(element.company_id) === -1) {
                  allowedCompanies.push(element.company_id);
                  newComp[element.company_id] = element.weight;
              }
              else {
                  if(newComp[element.company_id] < element.weight) {
                      newComp[element.company_id] = element.weight;
                  }
              }
          });
          let clientComp = {};
          let userRoles = await Database
                .select('*')
                .from('user_role_relations')
                .leftJoin('roles', 'user_role_relations.role_id', 'roles.id')
                .where('user_role_relations.user_id', '=', user.id)
                .where('roles.weight',  '>', 0)
                .whereIn('company_id', allowedCompanies)
                .orderBy('roles.weight', 'asc');
        userRoles.forEach(function(element) {
            if(clientComp[element.company_id] === undefined) {
                clientComp[element.company_id] = element.weight;
            }
            else {
                if(clientComp[element.company_id] > element.weight) {
                    clientComp[element.company_id] = element.weight;
                }
            }
        });

        const lngth = userRoles.length;
        for(let key in clientComp) {
            if(clientComp[key] < newComp[key]) {
                allowed = 'y';
                break;
            }
        }
       
        if(allowed !== 'y') {
            let isTrainer = await Database
                .from('user_role_relations')
                .where('user_role_relations.user_id', '=', auth.user.id)
                .where('role_id', '=', 2).count();
            if(isTrainer[0].count > 0) {
                let isTrainersClient = await Database
                .from('trainer_client_relations')
                .where('client_id', '=', user.id)
                .where('trainer_id', '=', auth.user.id).count('user_role_relations.id');
                if(isTrainersClient[0].count > 0) {allowed = 'y';}
            }
        }
        if (allowed !== 'y') {
            return response.status(403).json({message: 'Not Allowed'});
        }
        
        //return response.json({outa: newComp, outc:clientComp, rls:userRoles, allowed:allowedCompanies, user:auth.user});
          
      }
      
      const input = request.only(['email', 'password', 'public_email', 'first_name', 'last_name', 'state',
          'city', 'address_line1', 'address_line2', 'phone', 'sex', 'birthdate',
          'profile_img', 'bio', 'additional_info', 'preferred_gym_locations']);
      user.email = input.email;
      if(input.password !== undefined && input.password !== null) {
          user.password = input.password;
      }
      if(input.public_email !== undefined && input.public_email !== null) {
          user.public_email = input.public_email;
      }
      user.first_name = input.first_name;
      user.last_name = input.last_name;
      user.state = input.state;
      user.city = input.city;
      user.address_line1 = input.address_line1;
      if(input.address_line2 !== undefined && input.address_line2 !== null) {
          user.address_line2 = input.address_line2;
      }
      user.phone = input.phone;
      user.sex = input.sex;
      console.log(input.birthdate);
      user.birthdate = moment(input.birthdate, "MM-DD-YYYY").format('YYYY-MM-DD');
      if(input.bio !== undefined && input.bio !== null) {
          user.bio = input.bio;
      }
      if(input.additional_info !== undefined && input.additional_info !== null) {
          user.additional_info = input.additional_info;
      }
      if(input.preferred_gym_locations !== undefined && input.preferred_gym_locations !== null) {
          user.preferred_gym_locations = input.preferred_gym_locations;
      }
      const profilePic = request.file('profile_image', {
        types: ['image'],
        size: '2mb'
      });
      
      if(profilePic != null) {
        await profilePic.move(Helpers.tmpPath(`uploads/user/${user.id}`), {
          name: `${profilePic.clientName}`,
          overwrite: true
        });
        if (!profilePic.moved()) {
          user.profile_img_url = null;
        }
        else {
            user.profile_img_url = `${user.id}/${profilePic.clientName}`;
        }
      }
      await user.save();
      return response.json({message: 'Done'});
  }
}

module.exports = UserController
