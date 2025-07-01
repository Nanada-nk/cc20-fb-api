import fs from 'fs/promises'
import cloudinary from "../config/cloudinary.config.js"
import path from 'path'
import prismaConfig from '../config/prisma.config.js'
import prisma from '../config/prisma.config.js'

export const getAllPosts = async (req, res, next) => {
  const resp = await prisma.post.findMany({
    orderBy: {createdAt: 'desc'},
    include: {
      user: {select: {
        firstName: true,
        lastName:true,
        profileImage:true
      }}
    }
  })


  // res.json({ message: 'Get all posts' })
  res.json({ posts: resp })
}

export const createPost = async (req, res, next) => {
  // console.log(req.body.message)
  // console.log(req.files)  // array

  const { message } = req.body
  console.log(req.file) // single
  let haveFile = !!req.file   // !! = boolean , null undefined = false
  let uploadResult = null
  if (haveFile) {

    // console.log('path.parse(req.file.path).name', path.parse(req.file.path).name)
    uploadResult = await cloudinary.uploader.upload(req.file.path,{
      overwrite:true,
      public_id:path.parse(req.file.path).name
    })
    fs.unlink(req.file.path)
  }
  const data = {
    message,
    image: uploadResult?.secure_url || '',
    userId: req.user.id
  }
  const rs = await prismaConfig.post.create({ data })

  // console.log(path.parse(req.file.path).name)
  // console.log(uploadResult)

  res.status(201).json({
    message: 'Create post done',
    file: req.file,
    result:rs
  })
}

export const updatePost = async (req, res, next) => {
  res.json({ message: 'Update post' })
}

export const deletePost = async (req, res, next) => {
  res.json({ message: 'Delete post' })
}

