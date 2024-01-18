import { Container } from 'inversify'
import 'reflect-metadata'
import {BooksRepository} from './BooksRepository'

// const Container = require('inversify')
// require('reflect-metadata')
// const BooksRepository = require('./BooksRepository')

const container = new Container()
container.bind(BooksRepository).toSelf()



// module.exports = container

export = container
