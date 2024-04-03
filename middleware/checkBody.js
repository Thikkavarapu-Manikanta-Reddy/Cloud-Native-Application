function checkBody(req,res,next){

    if(req.headers["content-length"]>0){
        return res.status(400).json().send();
    }
    next();
    
};

module.exports=checkBody