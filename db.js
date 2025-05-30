
require('dotenv').config();
var {Pool} = require('pg');


const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

const ConnectDB = async() =>{
    try {
        // console.log('Environment Variables:', process.env);

        pool.connect()
        .then(()=> console.log("COnnection Successful"))
        .catch((err)=> console.log(err)); 
    } catch (error) {
        console.log("Error catched:==>" , error);
    }
}

module.exports = {pool, ConnectDB};
