const dotenv = require('dotenv');
var path = require('path');
var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//Set up routers
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var messageRouter = require('./routes/message');
var imageRouter = require('./routes/image');
var feedRouter = require('./routes/feed')


/* load .env*/
dotenv.config();

// Set up database
const mongoose = require("mongoose");
//Set database username and password - throughout project used these variables in the link, but wouldn't load with npm pkg  
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD; 
const db_url = `mongodb+srv://admin:fipa4WmSVajHYl3I@cluster0.hei7umz.mongodb.net/?retryWrites=true&w=majority` 
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

//Connect to the database and tell user if connected
mongoose.connect(db_url, options).then(() => {
  console.log('successfully connected!')
}).catch((e) => {
  console.error(e, 'could not connect!')
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));


app.use(fileUpload());
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))


app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.redirect('/home/')
})

app.use('/home/', indexRouter);
app.use('/home/', authRouter);
app.use('/home/', messageRouter);
app.use('/images/', imageRouter);
app.use('/home/', feedRouter);

app.use(bodyParser.json());

const UserM = require('./models/user');
passport.use(UserM.createStrategy());
passport.serializeUser(UserM.serializeUser());
passport.deserializeUser(UserM.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(err.status != 404){
  res.status(err.status || 500);
  res.render('error');
  } else {
    res.render('404-not-found');
  }
});

const PORT = process.env.PORT;
app.listen(8080, () => {
    console.log(`Server is live http://localhost:8080`);
});



