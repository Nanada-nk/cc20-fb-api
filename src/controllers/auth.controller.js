// const authController = {}
// authController.login
// export default authController

export function register(req, res, next) {
  try {
    res.json({
      msg: "Register controller",
      body: req.body
    })
  } catch (error) {
    next(error)
  }
}

export const login = (req, res, next) => {
  try {
    res.json({
      msg: "Login controller",
      body: req.body
    })
  } catch (error) {
    next(error)
  }
}

// export const getMe = (name) => {
//   return function (req, res, next) {
//     res.json({
//       name: name
//     })
//   }
// }

export const getMe = (req, res, next) => {
  try {
    res.json({ msg: "Get Me controller"})
  } catch (error) {
    next(error)
  }
}