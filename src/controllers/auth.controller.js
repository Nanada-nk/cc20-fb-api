import prisma from "../config/prisma.config.js"
import checkIdentityUtil from "../utils/check-identity.util.js"
import createError from "../utils/create-error.util.js"


export async function register(req, res, next) {

  const { identity, firstName, lastName, password, confirmPassword } = req.body
  // validation
  if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
    createError(400, "Please fill all data")
  }

  if (password !== confirmPassword) {
    createError(400, 'check confirm password')
  }

  // identity เป็น email  หรือ mobile phone number built function checkIdentity(identity) => String : 'email' | 'mobile'
  const identityKey = checkIdentityUtil(identity)

  // หา user
  const foundUser = await prisma.user.findUnique({
    where: { [identityKey]: identity }
  })
  console.log('foundUser', foundUser)
  if(!foundUser) {
    createError(409, `Already have this user: ${identity}`)
  }

  // เช็คแล้ว ไม่พบ user ก็สร้าง user
  const newUser = {
    [identityKey] : identity,
    password : await bcrypt.hash(password,10),
    firstName: firstName,
    lastName : lastName
  }

  const result = await prisma.user.create({data:newUser})
  console.log('result', result)

  res.json({
    msg: "Register controller",
    body: req.body
  })
}

export const login = (req, res, next) => {
  res.json({
    msg: "Login controller",
    body: req.body
  })
}

// export const getMe = (name) => {
//   return function (req, res, next) {
//     res.json({
//       name: name
//     })
//   }
// }

export const getMe = async (req, res, next) => {
  let numUser = await prisma.user.count()
  console.log(numUser)
  createError(403, "Block!!")
  res.json({ msg: "Get Me controller", numUser })
}