const express = require('express')
const app = express();
const cors = require("cors");
app.use(cors())
app.use(express.json());
app.listen(process.env.PORT || 4000);
const mongodb = require("mongodb");
const URL  = "mongodb+srv://dbuser:error404@cluster0.dda10.mongodb.net/mentor?retryWrites=true&w=majority";
const DB = "mentor";

let mc = 1 ; 
let sc =1;
app.post("/mentor",async (req,res)=>{
    req.body.id = mc;
    req.body.students =[];
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    console.log(req.body);
    let user = await db.collection("mentor").find({name:req.body.name}).toArray(); 
    console.log(user.length);
    if(user.length==0)
    {
    await db.collection("mentor").insertOne(req.body);
    mc++;
    res.json({
        message : "Mentor created"
    })}
    else
    {
        res.json({
            message : "Mentor already exist"
        })  
    }
     
    })
    


app.post("/student",async (req,res)=>{
    req.body.id = sc ; 
    req.body.mentor_id = 0 ;
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    if((await db.collection("student").find({name:req.body.name}).toArray()).length==0)
    {
    await db.collection("student").insertOne(req.body);
    sc++;
    res.json({
        message : "student created"
    })}
    else
    {
        res.json({
            message : "student already exist"
        })  
    }
     
    }
)


app.put("/student/:id",async (req,res)=>{

    /*
        input data must be in below format
       {
           name : "name of new mentor"
       }
*/ 
let connection = await mongodb.connect(URL);
let db = connection.db(DB);
let student = await db.collection("student").find({id:(+req.params.id)}).toArray()
 console.log(student);
 if(student.length!=0)
 {
    // console.log((Object.keys(students[stdindex]).findIndex((feild)=>feild=="mentor_id")))
 
    await db.collection("mentor").updateOne({name:req.body.name},{$push:{students:student[0]}})
    let mentor = await db.collection("mentor").find({name:req.body.name}).toArray();
    await db.collection("student").updateOne({id:+(req.params.id)},{$set:{mentor_id:mentor[0].id}})
    res.json({"message":"student updated"});
}

})

app.get("/mentor",async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let mentor = await db.collection("mentor").find().toArray();
    res.send(mentor);    
})

app.get("/student",async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let student = await db.collection("student").find().toArray();
    res.send(student);
})

app.get("/mentor/:id",async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let mentor = await db.collection("mentor").find({id:(+req.params.id)}).toArray();
    res.send(mentor[0]);  
})
app.get("/student/:id",async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let student = await db.collection("student").find({id:(+req.params.id)}).toArray();
    res.send(student[0]);  
})
app.delete("/student/:id",async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db.collection("student").deleteOne({id:(+req.params.id)});
    res.send({"message":"deleted"});
})

app.delete(("/mentor/:id"),async (req,res)=>{
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db.collection("mentor").deleteOne({id:(+req.params.id)});
    res.send({"message":"deleted"});
})
