const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.body.token ||
      req.query.token ||
      req.headers['auth-token'] ||
      req.headers['x-access-token'] || false;

  if (!token) return res.send({success:false, message:'Unauthorized Access'})

  try{
    const { uid } = jwt.verify(token, process.env.TOKEN_SECRET)
    req.body = {...req.body, id : uid}
    next();
  } catch (err){
    res.send({success:false, message:'Unauthorized Access'})
  }
}
