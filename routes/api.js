/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = function (app) {
  let bookSchema = new mongoose.Schema({
    title: { type: String, require: true },
    comments: { type: [String] },
    commentcount: { type: Number },
  });

  let Book = mongoose.model("Book", bookSchema);

  app
    .route("/api/books")
    .get(function (req, res) {
      Book.find({}).exec(function (err, data) {
        if (err) return console.error(err);
        res.json(data);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.json("missing required field title");
      } else {
        let newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0,
        });
        newBook.save(function (err, data) {
          if (err) return console.error(err);
          console.log(data);
          res.json({ _id: data._id, title: data.title });
        });
      }
    })

    .delete(function (req, res) {
      console.log("delete all");
      Book.find({})
        .deleteMany({})
        .exec(function (err, data) {
          if (err) return console.error(err);
          console.log("delete successful");
          res.json("complete delete successful");
        });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      console.log("get /api/books/:id");
      console.log("book id:", req.params.id);
      let bookid = req.params.id;
      Book.findById({ _id: bookid }, function (err, data) {
        if (err || data == null) {
          res.json("no book exists");
          return console.error(err);
        }
        console.log("found book, returned data");
        res.json(data);
      });
    })

    .post(function (req, res) {
      console.log(
        "post comment:",
        "bookid:",
        req.params.id,
        "comment:",
        req.body.comment
      );
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment || comment === null || comment === undefined) {
        res.json("missing required field comment");
      } else {
        Book.findById({ _id: bookid }, function (err, data) {
          if (err || data == null) {
            console.log("couldnt find book");
            res.json("no book exists");
            return console.error(err);
          }
          data.comments.push(comment);
          data.commentcount++; // or data.commentcount = data.comments.length
          data.save(function (err, data) {
            if (err) return console.error(err);
            console.log("found and updated");
            res.json(data);
          });
        });
      }
    })

    .delete(function (req, res) {
      console.log("delete by id:", req.params.id);
      let bookid = req.params.id;
      Book.findByIdAndRemove({ _id: bookid }, function (err, data) {
        if (err || data == null) {
          console.log("couldnt find book");
          res.json("no book exists");
          return console.error(err);
        }
        console.log("found and deleted");
        res.json("delete successful");
      });
    });
};
