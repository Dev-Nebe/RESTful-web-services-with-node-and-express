/* eslint-disable no-param-reassign */
const express = require('express');
const debug = require('debug')('app:bookRouter');
const booksController = require('../controllers/booksController');

const router = (Book) => {
  const bookRouter = express.Router();
  bookRouter.route('/books')
    .post(booksController(Book).post)
    .get(booksController(Book).get);

  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      const genre = returnBook.genre.replace(' ', '%20');
      returnBook.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      res.json(returnBook);
    })
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      book.bookId = req.body.bookId;
      book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
      const { book } = req;
      debug(Object.keys(req.body));
      // debug(Object.entries(book));
      if (Object.keys(req.body).length > 0) {
        // This removes the id from the patch request so the unique identifier of the book isn't modified
        // eslint-disable-next-line no-underscore-dangle
        if (req.body._id) {
          // eslint-disable-next-line no-underscore-dangle
          delete req.body._id;
        }
        // This maps the patches to the book item
        Object.keys(req.body).forEach((item) => {
          book[item] = req.body[item];
        });
        book.save((err) => {
          if (err) {
            return res.send(err);
          }
          return res.json(book);
        });
      } else {
        res.send(book);
      }
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });
  return bookRouter;
};

module.exports = router;
