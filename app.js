const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js')

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.set('view engine','ejs');

const items=['Buy Food','Cook Food','Eat Food'];
const workItems=[];

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');

    const day = date.getDate();
    res.render('list',{listTitle:day,morelihere:items});
});

app.post('/',function(req,res){
    const item = req.body.addtask;

    if(req.body.list==='Work List'){
        workItems.push(item);
        res.redirect('/work');
    }else{
        items.push(item);
        res.redirect('/');
    }
    console.log(item);
});

app.get('/work',function(req,res){
    res.render('list',{listTitle: "Work List",morelihere:workItems})
});

app.get('/about',function(req,res){
    res.render('about');
})

app.listen(process.env.PORT || 3000,function(){
    console.log('Server started');
});