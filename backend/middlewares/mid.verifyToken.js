import jwt from "jsonwebtoken"

export function verifyToken(req, res, next){
    const authHeader = req.header("Authorization");

    if(!authHeader){
        return res.status(403).json({message: "Access denied! No token provided!"});
    }else if(!authHeader.startsWith("Bearer")){
        return res.status(403).json({message: "Access denied! Invalid token provided!"});
    }

    const token =  authHeader.split(" ")[1];
    
    try{
        const decode = jwt.verify(token, "MY_JWT_SECRET_KEY");
        req.user = decode;
        next();
    }catch(err){
        res.status(500).json({message: err.message});
    }
}