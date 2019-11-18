const debug = require('debug')('app:booksController');

const booksController = (Book) => {
  const post = (req, res) => {
    const book = new Book(req.body);
    debug(book);
    book.save();
    return res.status(201).send('Your book has been saved');
  };
  const get = (req, res) => {
    debug('Get request received');
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  };

  return { post, get };
};

module.exports = booksController;
