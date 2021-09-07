const express = require('express');
const app = express();
const PORT = process.env.PORT || 9700;


app.use(express.urlencoded({extended:true}));
app.use(express.json());





app.use('/',require('./controller/routes'))

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${PORT}`)
})
