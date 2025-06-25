import {PrismaClient}  from "../generated/prisma/index.js"

const prisma = new PrismaClient()

export default prisma

// export default new PrismaClient()

// prisma.user.count().then(console.log)
// prisma.user.count().then(rs => console.log())

// prisma.$queryRaw`Select * from user`.then(console.log)