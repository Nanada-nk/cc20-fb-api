import dotenv from 'dotenv'
import app from './app.js'
import shutdown from './utils/shutdown.util.js'




dotenv.config()   // สั่งอ่านไฟล์ env ว่ามีอะไรบ้าง
// console.log(process.env.PORT)


// console.log('app', app)
const PORT = process.env.PORT || 8000 // 8000 play save
app.listen(PORT,()=>console.log(`Server on : ${PORT}`))


process.on("SIGINT", ()=>shutdown("SIGINT"))
process.on("SIGTERM", ()=>shutdown("SIGTERM"))

process.on("uncaughtException", ()=>shutdown("uncaughtException"))
process.on("unhandledRejection", ()=>shutdown("unhandledRejection"))