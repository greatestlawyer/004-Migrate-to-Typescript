// const router = require('express').Router()
import Router from "express";
const router = Router();

router.get('/', (_req: any, res: any) => {
  res.render('index', { title: 'Главная' })
})

export = router

