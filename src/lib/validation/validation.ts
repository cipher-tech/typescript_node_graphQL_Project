import * as bcrypt from 'bcrypt'
import { check } from 'express-validator/check'
// import { where } from 'sequelize'
import { User} from '../config/models/user'

export const Rules = {
    RegisterValidation: [
        check('email')
        .isEmail().withMessage('Invalid email format')
        .custom(email => User.findOne({where: {email} }).then(user => !!!user)).withMessage('Invalid email format'),

        check('password')
      .isLength({ min: 8 }).withMessage('Invalid password'),
      check('last_name').isAlpha(),
      check('first_name').isAlpha(),
      check('phone_no').isNumeric()
    ],

    loginValidation: [
        check('email')
        .isEmail().withMessage('Invalid email format')
        .custom(email => User.findOne({ where: { email } }).then(u => !!u)).withMessage('Invalid email or password'),

        check('password')
        .custom((password, {req}) =>{
            return User.findOne({where: {email: req.body.email}})
            .then((user) => bcrypt.compare(password, user!.password!))
        }).withMessage('Invalid email or password')
    ]
}