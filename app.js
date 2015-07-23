var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    logger = require('morgan'),
    favicon = require('serve-favicon')
var app = express()
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger('dev'))
app.use(favicon(__dirname + '/public/images/favicon.ico'))
app.use(stylus.middleware(
    {   src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname +'/public'));
app.get('/', function (req, res) {
    res.render('layout', { title : 'Home' })
})
app.listen(3000)