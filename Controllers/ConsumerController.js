// Import Connection
const db = require('../connection/Connection')

// Import Helpers
const HashPassword = require('../Helpers/HashPassword')
const ActivationCode = require('../Helpers/ActivationCode')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const handlebars = require('handlebars')

// Register
const Register = (req,res) => {
    try{
        // get all data
        const data = req.body

        // Validasi data & buat token
        if(!data.email && !data.password && data.username) throw { message: 'All Data Must Be Filled' }
        if(!(validator.isEmail(data.email))) throw { message: 'Email Invalid' }
        if(data.password.length < 6 || data.password.length>12) throw { message: 'Password Length must be 6-12 Character' }

        // hash password and activation code
        try{
            const NewPassHash = HashPassword(data.password)
            data.password = NewPassHash

            const Code = ActivationCode()
            
            // Send token
            jwt.sign({email: data.email, password: NewPassHash},'123abc',(err,token)=>{
                try{

                    const DataToSend = {
                        username: data.username,
                        email: data.email,
                        password: NewPassHash,
                        activation_code: Code,
                        token: token,
                        role: 0
                    }

                    // Store data to DB
                    let Query1 = 'SELECT * FROM users WHERE email = ?'
                    db.query(Query1, data.email,(err,result)=>{
                        try{
                            if(err) throw err

                            if(result.length === 0){
                                db.query('INSERT INTO users SET ?',DataToSend,(err,res)=>{
                                    try{
                                        if(err) throw err
                                        // console.log(DataToSend)
                                        res.status(200).send({
                                            error: false,
                                            message: "Register Success"
                                        })

                                    }catch(error){
                                        res.status(500).send({
                                            error: true,
                                            message: "Register Failed"
                                        })
                                    }
                                })
                            }else if(result.length === 1){
                                res.status(500).send({
                                    error: true,
                                    message: 'Email already exist'
                                })
                            }
                        }catch(err){
                            res.status(500).send({
                                error: true,
                                message: err.message
                            })
                        }
                    })

                }catch(error){
                    res.status(500).send({
                        error: true,
                        message: 'Token Error'
                    })
                }
            })

        }catch(error){
            res.status(500).send({
                error: true,
                message: 'Failed to hash password'
            })
        }

    }catch(error){
        res.status(406).send({
            error: true,
            message: error.message
        })
    }
}

// Login
const Login = (req,res) => {
    try{
        // get all data
        const data = req.body

        //validasi data
        if(!data.email && !data.password) throw {message:'Filled all data!'}

        //hash password
        const NewPass = HashPassword(data.password)

        //find email & password
        let Query2 = 'SELECT * FROM users WHERE email = ? AND password = ?'
        db.query(Query2,[data.email,data.password],(err,result)=>{
            try{
                if (err) throw err

                //kalo ada akunnya
                if(result.length === 1){
                    db.query('UPDATE users SET is_login = 1 WHERE email = ? AND password = ?',[data.email,data.password],(error,res)=>{
                        try {
                            if(error) throw error
                            
                            res.status(200).send({
                                error: false,
                                message: "Login Success"
                            })
                        } catch (error) {
                            res.status(500).send({
                                error: true,
                                message: 'Login Failed'
                            })
                        }
                    })
                }else{
                    res.status(500).send({
                        error: true,
                        message: 'Account not Found'
                    })
                }

            }catch(err){
                res.status(500).send({
                    error: true,
                    message: err.message
                })
            }
        })


    }catch(error){
        res.status(406).send({
            error: true,
            message: error.message
        })
    }
}


module.exports = {
    Register: Register,
    Login: Login
}