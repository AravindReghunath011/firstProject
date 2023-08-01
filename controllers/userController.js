

module.exports ={
    userLogin:(req,res)=>{
        res.render('users/login')
    },


    getSignup:(req,res)=>{
        res.render('users/signup')
    },


    userSignup:(req,res)=>{
        console.log(req.body);
    }
    
}