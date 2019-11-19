require('should');
const sinon = require('sinon');
const bookController = require('../controllers/booksController');

describe('Book Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {
      class Book {
        constructor() {
          this.save = () => {};
        }
      }
      // The next line sets up a new request without a title in its body
      const req = { body: { author: 'Jon' } };
      const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

      const controller = bookController(Book); // This passes the Book constructor into the controller
      controller.post(req, res); // This right here creates as a post request with the necessary parameters

      //  Now these are the actual tests
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`); // First we expect the res.status to have been set to 400 because the req.body is missing the required title
      res.send.calledWith('Title is required').should.equal(true); // Next, we expect the a response saying 'Title is required' to have been sent by the server to the client
    });
  });
});
