import { object, string, number, date, ref } from 'yup'
import createError from '../utils/create-error.util.js'


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobileRegex = /^[0-9]{10,15}$/

export const registerSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  identity: string()
    .test('Identity check',
      'Identity must be a valid email or mobile number',
      value => {
        if (!value) { return true }
        return emailRegex.test(value) || mobileRegex.test(value)
      }),
  password: string().min(4).required(),
  confirmPassword: string().oneOf([ref("password")], `confirmPassword must match password`),
  // email: string().email(),
  email: string().test('must an email','email is invalid', value => !value || emailRegex.test(value)),
  mobile: string().matches(mobileRegex)

}).transform((value) => {
  if (value.email || value.mobile) {
    delete value.identity
    return value
  }

  const newValue = ({ ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile']: value.identity })
  // if(newValue.identity) delete newValue.identity
  delete newValue.identity
  return newValue


  // return ({ ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile']: value.identity })
}).test(
  'require-identity-or-email-or-mobile',
  'At least one of identity, email, or mobile must be provided',
  value => {
    // return Boolean (value.identity || value.email || value.mobile);
    return !!(value.identity || value.email || value.mobile);
  }
).noUnknown()


export const validate = (schema,options = {}) => {
  return async function (req,res,next) {
    try {
      const cleanBody = await schema.validate(req.body, {abortEarly:false, ...options})
      req.body = cleanBody
      next()
    } catch (err) {
      console.log('err.errors', err.errors)
      createError(400,err.errors)
    }
  }
}


// let data = {
//   firstName: "Andy",
//   lastName: "Codecamp",
//   // identity: "someone@ggg.mail",
//   // email: 'andy@ggg.mail',
//   mobile: "1234567890",
//   identity: '1234567890',
//   password: "123456",
//   confirmPassword: "123456",
//   status: "buy"
// }

// registerSchema.validate(data, { abortEarly: false }).then(console.log)
//   .catch(err => {
//     console.log(err.errors)
//   })

// export function validate(schema, options = {}) {
//   return async function (req, res, next) {
//     try {
//       const cleanBody = await schema.validate(req.body,
//         { abortEarly: false, ...options })
//       req.body = cleanBody
//       next()
//     } catch (err) {
//       let errMsg = err.errors.join('|||')
//       console.log(errMsg)
//       createError(400, errMsg)
//     }
//   }
// }

