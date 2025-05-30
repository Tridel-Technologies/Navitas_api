const express = require('express');
const { ConnectDB } = require('./db');
const router = require('./router/router');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = process.env.API_PORT || 3200;


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


ConnectDB();

app.use('/api', router);


app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})


