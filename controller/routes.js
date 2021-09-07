const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../config/config.js')




router.get('/userInfo',(req,res)=>{
    var data = fs.readFileSync('./data/config.json')
    var myObj ;

    try {
      myObj = JSON.parse(data);
        return res.send(myObj)
      
    }
    catch (err) {
      console.log('There has been an error parsing your JSON.')
      console.log(err);
      }
})

router.post('/register',(req,res)=>{
  var data = {}
  
    const user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    }
    data = JSON.stringify(user);
    fs.appendFile('./data/config.json', data, function (err) {
      if (err) {
        console.log('There has been an error saving your configuration data.');
        console.log(err.message);
        return;
      }
      return res.send("User added")
    });
})



router.post('/login',(req,res)=>{

  var data = fs.readFileSync('./data/config.json'),
  myObj;
  try {
    myObj = JSON.parse(data);
    if(myObj.email!=req.body.email){
      return res.send('User Does not Exists! Please Try agan')
    }else{
      if(myObj.password!=req.body.password){
        return res.send('Please enter correct credential')
      }else{
        const token = jwt.sign({id:myObj.email}, config.secrete, {expiresIn: 86400});

        return res.send({auth:true,token:token})
      }
    }
  }catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
})

router.patch('/updateUser/:email_id',(req,res)=>{
    const token = req.headers['x-access-token']
    if(!token) return res.send({auth:false, "error":"No token provided"});
    jwt.verify(token,config.secrete,(err,result)=>{
        if(err) return res.status(500).send({auth:false, "error":"Invalid token"})
         var data = fs.readFileSync('./data/config.json')
    var myObj;

    try {
      myObj = JSON.parse(data);
      console.log(myObj)
      myObj.forEach(user => {
        if(user.email==req.params.email_id){
          user.name=req.body.name?req.body.name:user.name,
          user.email=req.body.email?req.body.email:user.email,
          user.password=req.body.password?req.body.password:user.password
          return res.send(user)
        }
      });
    }
    catch (err) {
      console.log('There has been an error parsing your JSON.')
      console.log(err);
      }
    })
})

router.delete('/deleteUser/:email_id',(req,res)=>{
    const token = req.headers['x-access-token']
    if(!token) return res.send({auth:false, "error":"No token provided"});
    jwt.verify(token,config.secrete,(err,result)=>{
        if(err) return res.status(500).send({auth:false, "error":"Invalid token"})
         var data = fs.readFileSync('./data/config.json')
          var myObj;

          try {
            myObj = JSON.parse(data);
            console.log(myObj)
            data = myObj.filter(user=>{
              user.email!=req.params.email_id
            })
            fs.appendFile('./data/config.json', JSON.stringify(data), function (err) {
              if (err) {
                console.log('There has been an error updating your configuration data.');
                console.log(err.message);
                return;
              }
              return res.send("User Updated")
            }); 
          }
          catch (err) {
            console.log('There has been an error parsing your JSON.')
            console.log(err);
            }
          })
})


module.exports = router