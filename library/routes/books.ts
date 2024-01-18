
import { Router } from "express";
import  {fileMiddleware}  from "../middleware/file";
import { incCounter, getCounter } from "../api/counter";
import container  from "../container";
import {BooksRepository}  from "../BooksRepository";

const router = Router();

const props: string[] = [
  'title',
  'description',
  'authors',
  'favorite',
  'fileCover',
  'fileName'
]

router.get('/view', async (_req: any, res: any) => {
  const repo = container.get(BooksRepository)
  const books = await repo.getBooks()

  res.render('books/index', { title: 'Книги', books })
})

router.get('/view/:id', async (req: any, res: any) => {
  const { id } = req.params
  const repo = container.get(BooksRepository)
  const book = await repo.getBook(id)

  if (book) {
    await incCounter(id)
    const counter = await getCounter(id)

    res.render('books/view', {
      title: 'Просмотр книги',
      book,
      counter
    })
  } else {
    res.status(404).redirect('/404')
  }
})

router.get('/create', (_req: any, res: any) => {
  res.render('books/create', { title: 'Добавление книги', book: {} })
})

router.post('/create', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const newBook = {}

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

    res.redirect('/books/view')
  } catch (e) {
    console.error(e)
  }
})

router.get('/update/:id', async (req: any, res: any) => {
  const { id } = req.params
  const repo = container.get(BooksRepository)
  const book = await repo.getBook(id)

  if (book) {
    res.render('books/update', {
      title: 'Редактирование книги',
      book
    })
  } else {
    res.status(404).redirect('/404')
  }
})

router.post(
  '/update/:id',
  fileMiddleware.single('fileBook'),
  async (req: any, res: any) => {
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

      res.redirect('/books/view/' + id)
    } else {
      res.status(404).redirect('/404')
    }
  }
)

router.post('/delete/:id', async (req: any, res: any) => {
  const { id } = req.params

  try {
    const repo = container.get(BooksRepository)
    await repo.deleteBook(id)

    res.status(200).redirect('/books/view')
  } catch (e) {
    console.error(e)
    res.status(404).redirect('/404')
  }
})

module.exports = router
