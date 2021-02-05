/**
 * Created by rekha on 2/1/2021.
 */
/**
 * Created by rekha on 1/22/2021.
 */
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookdb', {useNewUrlParser: true, useUnifiedTopology: true});


// collection schema
var bookSchema = mongoose.Schema({
    name: String,
    author: String

});

// collection name , object creation
var Book = mongoose.model("c_books", bookSchema);


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'html');
//app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.get('/api/v1/book', function (req, res) {
    res.render('show_message');
});

app.get('/api/v1/newbook', function (req, res) {
    res.render('new_book_entry');
});


app.post('/api/v1/addnewbook', function (req, res) {
    try {
        var bookInfo = req.body;

        var dbBookObj = new Book({
           name: bookInfo.name,
            author: bookInfo.author
        });
        dbBookObj.save(function (err, response) {
            res.render('show_message', response);
            console.log("Inserted successfully");
        });
    }

    catch (error) {
        return res.status(400).json({error: error.toString()});
    }
});


app.get('/api/v1/showonebook', function (req, res) {
    res.render('show_message');
    Book.findOne({name}, function (err, result) {
        if (err) throw err;
        console.log("one record", result);

    });

});


app.get('/api/v1/showallbooks', function (req, res) {

    Book.find({}, function (err, result) {
        if (err) throw err;
        console.log("Many records", result);
        res.send(result);
    });

});

app.put('api/v1/:id', function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body, function(err, response){
        if(err) res.json({message: "Error in updating book with id " + req.params.id});
        res.json(response);
    });
});

app.delete('/api/v1/delete/:id',function(req, res) {
    var id=req.params.id;
    Book.findByIdAndDelete(req.params.id, function(err, response) {
        if (err) throw err;
        console.log(" document(s) deleted", id);
        res.send(response);

    });
});


app.listen(3000);
