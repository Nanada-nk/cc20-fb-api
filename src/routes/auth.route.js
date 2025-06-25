import express from 'express'
// import { getMe, login, register } from '../controllers/auth.controller.js'
import * as authController from '../controllers/auth.controller.js'
import { registerSchema, validate } from '../validations/validator.js'

const authRoute = express.Router()

authRoute.post("/login", authController.login)
// authRoute.post("/register",validate(registerSchema) ,authController.register)
authRoute.post("/register",validate(registerSchema) ,authController.registerYup)
authRoute.get("/me", authController.getMe)
// authRoute.get("/me", authController.getMe("Nobita"))
// authRoute.get("/me", (req, res, next) => {authController.getMe(req, res, next, "Nobita")})


export default authRoute