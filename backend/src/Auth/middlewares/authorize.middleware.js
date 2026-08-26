const Role = require("../models/role.model");

const authorize =(...alloweRoles) =>{
    return async(req, res, next)=>{
        if(!req.user) return res.status(400).json({
            message:'unAuthorized : user not found❌'
        })

        const role = await Role.findById(req.user.role).select("name");//role name from role id in role collection in db
       console.log(role.name)
        const hasRole = alloweRoles.includes(role.name);
        if(!role || !hasRole ) return res.status(400).json({
            message:"access denied!❌"
        })
        next();
    }
}
module.exports = authorize;