// const router = require('express').Router()
import router from "express";
// const fileMiddleware = require('../../middleware/file')
import fileMiddleware from "../../middleware/file"; 
// const path = require('path')
import path from "path";

// const container = require('../../container')
import container from "../../container";
// const BooksRepository = require('../../BooksRepository')
import {BooksRepository} from "../../BooksRepository";

const props: string[] = [
  'title',
  'description',
  'authors',
  'favorite',
  'fileCover',
  'fileName'
]

router.Router().get('/', async (_req: any, res: any) => {
  const repo = container.get(BooksRepository)
  const books = await repo.getBooks()

  res.status(200).json(books)
})

router.Router().get('/:id', async (req: any, res: any) => {
  const { id } = req.params
  const repo = container.get(BooksRepository)
  const book = await repo.getBook(id)

  if (book) {
    res.status(200).json(book)
  } else {
    res.status(404).send('not found')
  }
})

router.Router().post('/', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const newBook  = {}

  const { body, file } = req

  props.forEach((p) => {
    if (body[p] !== undefined) {
      newBook[p] = body[p]
    }
  })

  if (file) {
    newBook.fileBook = file.path
  }

  try {
    const repo = container.get(BooksRepository)
    const book = await repo.createBook(newBook)

    await book.save()

    res.status(201).json(book)
  } catch (e) {
    console.error(e)
  }
})

router.Router().put('/:id', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const { id } = req.params
  const repo = container.get(BooksRepository)
  const book = await repo.getBook(id)

  if (book) {
    const { body, file } = req

    props.forEach((p) => {
      if (body[p] !== undefined) {
        book[p] = body[p]
      }
    })

    if (file) {
      book.fileBook = file.path
    }

    res.status(200).json(book)
  } else {
    res.status(404).send('not found')
  }
})

router.Router().delete('/:id', async (req: any, res: any) => {
  const { id } = req.params

  try {
    const repo = container.get(BooksRepository)
    await repo.deleteBook(id)

    res.status(200).send('ok')
  } catch (e) {
    console.error(e)
    res.status(404).send('not found')
  }
})

router.Router().get('/:id/download', async (req: any, res: any) => {
  const { id } = req.params
  const repo = container.get(BooksRepository)
  const book = await repo.getBook(id)

  if (book) {
    res.download(path.join(__dirname, '../..', book.fileBook), (err: any) => {
      if (err) {
        res.status(404).send('not found')
      }
    })
  } else {
    res.status(404).send('not found')
  }
})

export default router
// module.exports = router
