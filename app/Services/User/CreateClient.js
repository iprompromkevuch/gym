'use strict'

const User     = use('App/Models/User');
const dumps    = use('App/Utils/dumps');
const Database = use('Database');
const Helpers = use('Helpers');
const moment   = require('moment');

class CreateClient {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const profilePic = request.file('profile_image', {
                types: ['image'],
                size: '2mb'
            });

            // check if company exists
            const company = await Database.raw(`
                Select * from companies
                where id = ${input.company_id}
            `);
            if (!company.rows[0]) {
                return response.status(400).json({
                    message: `Company with id ${input.company_id} doesn't exist`,
                });
            }

            const userInfo = {
                email         : input.email,
                password      : input.password,
                public_email  : input.public_email,
                first_name    : input.first_name,
                last_name     : input.last_name,
                state         : input.state,
                city          : input.city,
                address_line1 : input.address_line1,
                address_line2 : input.address_line2,
                phone         : input.phone,
                sex           : input.sex,
                birthdate     : moment(input.birthdate, "MM-DD-YYYY").format('YYYY-MM-DD'),
            }

            const user = await User.create(userInfo);
            const token = await auth.generate(user);

            if (profilePic) {
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

                await user.save();
            }

            await Database.raw(`
                INSERT INTO user_role_relations (user_id, role_id, company_id)
                VALUES (${user.id}, 1, ${input.company_id})
            `);
            
            return response.status(201).json(dumps.dumpUser({...user['$attributes'], token}),
            );
        } catch (err) {
            console.log(err, 'err')
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/user/client:
  *   post:
  *     tags:
  *       - User API
  *     summary: Register new client
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
  *       - name: company_id
  *         description: company_id
  *         in: formData
  *         required: true
  *         type: integer
  *       - name: profile_image
  *         description: User's avatar
  *         in: formData
  *         required: false
  *         type: file
  *     responses:
  *       200:
  *         description: Register Ok
  *         example: {
                "id": 18,
                "email": "2s32e12me@gmail.comdafx",
                "password": null,
                "public_email": null,
                "first_name": "1",
                "last_name": "1",
                "state": "1",
                "city": "1",
                "address_line1": "1",
                "address_line2": "1",
                "phone": "1",
                "sex": "male",
                "birthdate": "2000-10-10",
                "profile_img_url": "18/1.jpeg",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE2MDc5NTA5ODJ9.P-PENNmrWLEFPPKxPsbIRZoloodFz-PemBuE1JENkYI",
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

module.exports = CreateClient;