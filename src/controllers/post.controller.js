import fs from 'fs/promises'
import cloudinary from "../config/cloudinary.config.js"
import path from 'path'
import prismaConfig from '../config/prisma.config.js'
import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.util.js'

export const getAllPosts = async (req, res, next) => {
  const resp = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true
        }
      },
      comments: true,
      likes: true
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
    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
      public_id: path.parse(req.file.path).name
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
    result: rs
  })
}

export const updatePost = async (req, res, next) => {
  const { id } = req.params
  const { message, removePic } = req.body

  const foundPost = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!foundPost || req.user.id !== foundPost.userId) {
    createError(400, 'Cannot this post')
  }

  const haveFile = !!req.file
  let uploadResult
  if (haveFile) {
    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
      public_id: path.parse(req.file.path).name
    })
    fs.unlink(req.file.path)
  }
  const data = haveFile
    ? { message, userId: req.user.id, image: uploadResult.secure_url, }
    : { message, userId: req.user.id, image: removePic ? '' : foundPost.image }

  const rs = await prisma.post.update({
    where: { id: Number(id) },
    data: data
  })

  res.json({ message: 'Update post done' })
}

export const deletePost = async (req, res, next) => {
  const { id } = req.params
  const foundPost = await prisma.post.findFirst({
    where: {
      id: Number(id)
    }
  })
  if (!foundPost) {
    createError(400, 'post-id not found')
  }

  if (req.user.id !== foundPost.userId) {
    createError(400, 'Cannot delete this post')
  }

  const rs = await prisma.post.delete({
    where: {
      id: Number(id)
    }
  })

  res.json({ message: 'Delete done' })
}

