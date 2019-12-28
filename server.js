const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api')
const cors = require('cors');

const app = express(); // instance of express

const PORT = 3003; //port number

app.use(bodyParser.json()); // handle json data 
app.use(cors());
app.use('/api', api)
//test get request
app.get('/',function(req,res){        //callback function
    res.send('Hello from server');
});

app.listen(PORT,function(){
    console.log("server running" + PORT)
});

// app.use(multer({ dest: ‘./uploads/’,
//     rename: function (fieldname, filename) {
//         return filename;
//     },
// }));



