const express = require('express');

const exphbs = require('express-handlebars');

const app = express();

app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

const port = 3000;
app.listen(port, function () {
  console.log("Example app listening on port " + "!");
});
