const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
const mongoose = require('mongoose');
const lodash = require('lodash');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

mongoose.connect(process.env.MONGO_DB_SERVER,{useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item",itemsSchema);

const items = [];

/* const items=['Buy Food','Cook Food','Eat Food'];
const workItems=[]; */

const item1 = new Item({
    name: 'Welcome to your todolist!'
});
const item2 = new Item({
    name: 'Hit the + button to add a new line.'
});
const item3 = new Item({
    name: '<-- Hit this to remove the item from the list'
});



const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List",listSchema);



app.get('/',function(req,res){
    Item.find((err,item)=>{
        console.log(item.length);
        if(item.length===0){
            Item.insertMany([item1,item2,item3],(err)=>console.log(err));
            res.redirect('/');
        }else{
            /* const day = date.getDate();
            res.render('list',{listTitle:day,morelihere:item});
             */
            res.render('list',{listTitle:'Today',morelihere:item});

             /* item.forEach(element => {
                items.push(element);
            }); */
        }
    });
});

app.get('/:customListName',(req,res)=>{
    const list = new List({
        name: lodash.capitalize(req.params.customListName),
        items: [item1,item2,item3]
    });

    List.findOne({name: list.name},(err,foundList)=>{
        if(!err){
            if(!foundList){
                list.save();
                res.redirect('/'+list.name);
            }else{
                res.render('list',{listTitle: foundList.name, morelihere: foundList.items})
            }
        }
    });

/*     List.find((err,l)=>{
        l.forEach((ele)=>{
            if(ele.name === list.name){
                if(ele.items.length===0){
                    list.save();
                    res.redirect('/'+list.name);
                }else{
                    // I created a  similar page of list.ejs called routes.ejs for all rest pages
                    res.render('routes',{listTitle: req.params.customListName, morelihere: list.items});
                }
            }
        })        
    })*/
});

app.post('/',function(req,res){
    const item = req.body.addtask;
    const listName = req.body.list;
    console.log(req.body);

    const newItem = new Item({
        name: item
    });

    if(listName==='Today'){
        newItem.save();
        res.redirect('/');
    }else{
        List.findOne({name:listName},(err,listItem)=>{
            if(!err){
                listItem.items.push(newItem);
                listItem.save();
                res.redirect('/'+listName);
            }
        });
    }
    // items.push(item);
});

app.post('/delete',(req,res)=>{
    const checkedItemID = req.body.checkbox;
    const listTitle = req.body.listName;

    if(listTitle==='Today'){
        Item.findByIdAndRemove(checkedItemID,(err)=>console.log(err));
        res.redirect('/');
    }else{
        List.findOneAndUpdate({name:listTitle},{$pull: {items:{_id:checkedItemID}}},(err,result)=>console.log(err));
        res.redirect('/'+listTitle);
    }
    // Item.deleteOne({_id:req.body.checkbox},(err)=>console.log(err));
    
});

app.listen(process.env.PORT || 3000,function(){
    console.log('Server started');
});