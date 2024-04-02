function checkParams(req,res,next){
    if (Object.keys(req.params).length !== 0 || Object.keys(req.query).length !== 0) {
        return res.status(400).send();
    }
    next();
};

module.exports=checkParams