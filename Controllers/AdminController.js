// Login
const Login = (req,res) => {
    try{
        console.log('helloworld')

    }catch(error){
        res.status(406).send({
            error: true,
            message: error.message
        })
    }
}