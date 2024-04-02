function checkMethodType(req,res,next){
    
    if(req.method!="GET"){
        return res.status(405).json().send();
    }
    else{
        next();
    }
};

function checkUserMethod(req, res, next){
    if(["GET", "POST", "PUT"].includes(req.method)){
        next();
    }
    else{
        return res.status(405).json().send();
    }
    
}

module.exports={checkMethodType, checkUserMethod}