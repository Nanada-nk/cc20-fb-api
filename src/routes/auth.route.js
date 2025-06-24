import express from 'express'
// import { getMe, login, register } from '../controllers/auth.controller.js'
import * as authController from '../controllers/auth.controller.js'

const authRoute = express.Router()

authRoute.post("/login", authController.login)
authRoute.post("/register", authController.register)
authRoute.get("/me", authController.getMe)
// authRoute.get("/me", authController.getMe("Nobita"))
// authRoute.get("/me", (req, res, next) => {authController.getMe(req, res, next, "Nobita")})


export default authRoute