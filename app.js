const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// this is a middleware which can get added to the any other route
// and it will enable the auth process on that endpoint
// if the session is not present i.e. session object it not there, then this auth will not work 
var auth = function(req, res, next) {
  if(req.session && req.session.user === 'amy' && req.session.admin) {
    return next();
  } else {
    return res.sendStatus(401);
  }
}

// this will simply create a session
// every time a client makes a connection
// it also creates a 'req.session' object
// we can then add more stuff to it as well
app.use(session({
  secret: 'randomsecret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Howdy World!!');
});

// when we login, we know a session is already setup
// and we simply add the 'user' and 'admin' info into the session object
app.post('/login', (req, res) => {
  if(!req.body.username || !req.body.password) {
    res.send('Login Failed');
  } else if(req.body.username === 'amy' && req.body.password === 'amypassword') {
    req.session.user = 'amy';
    req.session.admin = true;
    res.send('Login Successful');
  }
});

// now, we've added the auth middleware to this endpoint
// it will come into play before the content is rendered
app.get('/content', auth, (req, res) => {
  res.send('You can only see this after youve logged in');
});

// on this endpint, we clear the session object
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("logout success!");
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
