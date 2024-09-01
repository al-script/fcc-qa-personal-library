/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId;

suite("Functional Tests", function () {
  // /*
  // * ----[EXAMPLE TEST]----
  // * Each test should completely test the response of the API end-point including response status code!
  // */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  // /*
  // * ----[END of EXAMPLE TEST]----
  // */

  // can I comment out the example test? wont work if there aren't already books inputted...

  // let testId; // needs to be ouside the function?

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test title" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "response should contain _id key"
              );
              assert.property(
                res.body,
                "title",
                "response should contain title key"
              );
              testId = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "_id",
              "response should contain _id key"
            );
            assert.property(
              res.body[0],
              "title",
              "response should contain title key"
            );
            assert.property(
              res.body[0],
              "comments",
              "response should contain comments key"
            );
            assert.property(
              res.body[0],
              "commentcount",
              "response should contain commentcount key"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/6")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${testId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "_id", "response should contain _id key");
            assert.property(
              res.body,
              "title",
              "response should contain title key"
            );
            assert.property(
              res.body,
              "comments",
              "response should contain comments key"
            );
            assert.property(
              res.body,
              "commentcount",
              "response should contain commentcount key"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({ comment: "test comment" }) // this proper?
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "response should contain _id key"
              );
              assert.property(
                res.body,
                "title",
                "response should contain title key"
              );
              assert.property(
                res.body,
                "comments",
                "response should contain comments key"
              );
              assert.property(
                res.body,
                "commentcount",
                "response should contain commentcount key"
              );
              assert.equal(
                res.body.comments[0],
                "test comment",
                "test comment is in the comments array"
              );
              assert.equal(res.body.commentcount, 1, "comment count equals 1");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post(`/api/books/1`)
            .send({ comment: "comment of comments" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, "application/json");
              assert.equal(res.body, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${testId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/1`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists");
            done();
          });
      });
    });
  });
});
// test the brackets and parenthesis...
