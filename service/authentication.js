const jwt=require("jsonwebtoken"); 
const secretKey="Adil(00)$23";

function generateToken(user){
    const payload={
        _id:user._id,
    email:user.email,
    role:user.role
    }
    const token =jwt.sign(payload,secretKey);
    return token;
}

function validateToken(token){
    const payload=jwt.verify(token,secretKey);
    return payload;
}

module.exports={
    generateToken,
    validateToken,
}