const { validateToken } = require("../service/authentication");


function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName]//parsing cookie which is came from user to validate
        if(!tokenCookieValue)return next();//if there is no cookie that mean there is no user signed in 
    try {
        const userPayload=validateToken(tokenCookieValue);
        req.user=userPayload//if token is validate then give user the payload which says token is correct
    } catch (error) {}
    return next();//in any case call to next function
    };
}

module.exports={
    checkForAuthenticationCookie,
}