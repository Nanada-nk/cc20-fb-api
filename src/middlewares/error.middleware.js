// export default (err, req, res, next) => {
//   console.log(err.name)
//   err.customMsg = "CC20"
//   err.statusCode = 500
//   res.status(err.statusCode)
//     .json({
//       errorName: err.name,
//       error: err.message,
//       customMsg: err.customMsg
//     })
// }


export default function (err, req, res, next) {
  console.log(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ error: err.message })
}
