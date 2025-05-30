const {pool} = require('../db');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { log } = require('console');

const getUsers = async (req, res)=>{
    try {
        const query = 'SELECT * FROM users';
    const response = await pool.query(query);
    res.json(response.rows);
    
    } catch (error) {
        res.status(500).send(err);
        
    }
    
}


const addUser = async(req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({msg: 'Please fill in all fields'})
    }


    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3) RETURNING *`;

        // const request = new pool.request();
        const values = [name, email, hashPassword]
        // request.input('name', sql.NVarChar, name);
        // request.input('email', sql.NVarChar, email);
        // request.input('password', sql.NVarChar, hashPassword);

        const result = await  pool.query(query, values);

        res.status(201).json({
            message: "User Added Successfully",
            userId: result.rows[0],
            name: name,
            email: email,
            password: hashPassword
        })
    } catch (error) {
        console.log("Error: ", error);
        res.send(500).send(error);
        
    }
}


const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email  || !password ){
        return res.status(400).json({
            status:'Failed',
            message:'All Fields are required'})
    }

    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result1 = await pool.query(query,  [email]);

        const user = result1.rows[0];

        if(!user){
            return res.status(404).json({
                status:'Failed',
                message: "User not Found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                status:'Failed',
                message: "Invalid Password"
            })
        }
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email

        }
        res.json({
            status:"Success",
            data: userData
        })

    } catch (error) {
        console.log("Login Failed");
        res.status(500).json({message: error})
    }
}







module.exports = {
    getUsers,
    addUser,
    login
}