
import Router from "express";
import passport from "passport";
import bcrypt from "bcrypt";

// const User = require('../../models/User')
import User from "../../models/User";
// const bcryptConfig = require('../../bcryptConfig')
import bcryptConfig from "../../bcryptConfig";


const router = Router();

router.get('/login', function (_req: any , res: any) {
  res.render('user/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/login'
  }),
  function (req: any, res: any) {
    res.redirect('/')
  }
)

router.get('/signup', function (_req: any, res: any) {
  res.render('user/signup')
})

router.post('/signup', async (req: any, res: any) => {
  const { body } = req

  if (body.password === body['password-repeat']) {
    const salt = bcrypt.genSaltSync(bcryptConfig.saltRounds)
    const hashedPassword = bcrypt.hashSync(body.password, salt)

    const newUser = {
      login: body.username,
      password: hashedPassword
    }

    try {
      const user = new User(newUser)

      await user.save()

      res.redirect('/')
    } catch (e) {
      console.error(e)
    }
  }
})

router.get(
  '/me',
  function (req: any, res: any, next: any) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('/api/user/login')
    }
    next()
  },
  function (req: any, res: any) {
    res.render('user/profile', { user: req.user })
  }
)

router.get('/logout', function (req: any, res: any) {
  req.logout()
  res.redirect('/')
})

export = router
