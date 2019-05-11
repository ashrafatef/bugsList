// utilities imports
import express  from "express";
import cors from "cors";
import bodyParser from "body-parser";
const mongoose = require('mongoose').set('debug', true);
var ObjectID = require('mongodb').ObjectID;

// models imports
import Issue from './models/issue';
import { runInNewContext } from "vm";

const app = express();
const router = express.Router();


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/system_issues');

const connection = mongoose.connection ;

connection.once('open' , ()=>{
    console.log("mongo db connection established successfully");
});

router.route('/issues')
    .get((req , res)=>{
        Issue.find((err , issue)=>{
            if(err)
                console.log(err);
            else    
                res.json(issue)
        })
    })
router.route('/issues/:id').get((req , res)=>{
    console.log(typeof req.params.id);
    Issue.findById(new ObjectID(req.params.id) , (err , issue)=>{
        if(err)
            console.log(err);
        else
            res.json(issue); 
    });
});

router.route('/issues/add').post((req, res)=>{
    let issue = new Issue(req.body);
    issue.save()
        .then(issue =>{
            res.status(200).json({'issue' : 'added successfully'})
        })
        .catch(err=>{
            res.status(400).send('faild to create new issue');
        })
});

router.route('/issues/update/:id').post((req,res)=>{
    //console.log(req.param.id);
    Issue.findById(new ObjectID(req.params.id) , (err , issue)=>{
        // console.log("error is "+err);
        // console.log("body is "+issue);
        if(err){
            console.log(err);
        }else{
            issue.title = req.body.title ;
            issue.responsible = req.body.responsible ;
            issue.description  = req.body.description ;
            issue.severity = req.body.severity ;
            issue.status = req.body.status ;

            issue.save()
                .then(issue=>{
                    res.json('updated done');
                })
                .catch(err=>{
                    res.status(400).send('update faild');
                });
        }
    })
})

router.route('/issues/delete/:id').get((req,res)=>{
    Issue.findByIdAndDelete(new ObjectID(req.params.id), (err , issue)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json('remove successfuly done');
        }
    })
})



app.use('/api' , router);

app.get('/', (req,res)=>{
    res.send('hello world')
})

app.listen(3000 , ()=>{console.log('express server running on port 3000')})