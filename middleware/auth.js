require('dotenv').config();
const jwt = require('jsonwebtoken');

// whenever a private route is needed add this piece of middleware as a second parameter in the endpoint
// require auth in route
//route('/auth').post( auth, (req, res)
//token sent in header, with below reference
function auth(req, res, next){
  console.log('from auth',req.headers);

  const token = req.headers['x-auth-header'];


  // check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied'});
  }

  //if token isnt valid send back error response
  try {
    //verify token
    const decoded = jwt.verify( token,  process.env.JWT_SECRET);

    //add user from payload
    req.user = decoded;
    // req.user.model = 
    next();

  } catch(e) {
    res.status(400).json({ msg: 'Token is not valid'})
  }


} //auth

module.exports = auth;
