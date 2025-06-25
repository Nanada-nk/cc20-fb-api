import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.config.js'
import checkIdentity from '../utils/check-identity.util.js'
import createError from '../utils/create-error.util.js'

export async function register(req, res, next) {
  try {
    const { identity, firstName, lastName, password, confirmPassword } = req.body
    //validation
    if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
      createError(400, 'Please fill all data')
    }
    if (password !== confirmPassword) {
      createError(400, 'check confirm password')
    }
    // identity เป็น email หรือ mobile phone number : checkIdentity(identity) => String : 'email' | 'mobile'
    const identityKey = checkIdentity(identity)

    // หา user
    const foundUser = await prisma.user.findUnique({
      where: { [identityKey]: identity }
    })
    if (foundUser) {
      createError(409, `Already have this user: ${identity}`)
    }

    const newUser = {
      [identityKey]: identity,
      password: await bcrypt.hash(password, 10),
      firstName: firstName,
      lastName: lastName
    }

    const result = await prisma.user.create({ data: newUser })
    res.json({
      msg: 'Register controller',
      result: result
    })
  } catch (err) {
    next(err)
  }
}

export async function registerYup(req, res, next) {
  try {
    const { email, mobile, firstName, lastName, password } = req.body

    //find user
    if (email) {
      let foundUserEmail = await prisma.user.findUnique({ where: { email: email } })
      if (foundUserEmail) createError(409, `Email : ${email} already register`)
    }
    if (mobile) {
      let foundUserMobile = await prisma.user.findUnique({ where: { mobile: mobile } })
      if (foundUserMobile) createError(409, `Mobile : ${mobile} already register`)
    }

    const newUser = {
      email,
      mobile,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName
    }

    const result = await prisma.user.create({ data: newUser })

    res.json({msg: 'Register successful', result })

  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const {identity,password,email,mobile} = req.body
    const identityKey = email ? 'email' : 'mobile'

    const foundUser = await prisma.user.findUnique({
      where: {[identityKey]:identity}
    })
    if(!foundUser) {
      createError(401, "Invalid Login")
    }
    let pwOk = await bcrypt.compare(password, foundUser.password)
    console.log('pwOk', pwOk)
    if(!pwOk) {
       createError(401, "Invalid Login")
    }

    // create token
    const payload = {id:foundUser.id}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: '15d'
    })


    res.json({
      msg: 'Login successful',
      token:token
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    let numUser = await prisma.user.count()
    console.log(numUser)
    createError(403, "Block!!")
    res.json({ msg: 'Get me controller', numUser })
  } catch (err) {
    next(err)
  }
}