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
mongoose.connect('mongodb://localhost/bookdb', { useNewUrlParser: true, useUnifiedTopology: true });


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
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.get('/api/v1/book', function(req, res){
    res.render('main');
});



app.post('/api/v1/addnewbook', function(req, res){

    var bookInfo = req.body;

    var dbBookObj = new Book({
        name: bookInfo.name,
        author:bookInfo.author
    });

    dbBookObj.save(function(err, response){
        if(err)
            return res.send({error: err});
        else {
            var output = {
                message: "Saved to DB", type: "success", dbBookObj : response};
            console.log(output);
            res.render('show_message', output);

        }
    });
});


app.get('/api/v1/showonebook' , function(req, res){
    res.render('show_message');
    Book.findOne({}, function(err, result) {
        if (err) throw err;
        console.log("one record", result);

    });

});



app.get('/api/v1/showallbooks' , function(req, res){

    Book.find({}, function(err, result) {
        if (err) throw err;
        console.log("Many records" ,result);
        res.send(result);
    });

});

app.listen(3000);
