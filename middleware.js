const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(404).send('Access token not found');
  }
  const token = authHeader;
  try {
    const employee = jwt.verify(token, 'tuteck-caf');
    req.email = employee.email;
    req.name = employee.name;
    next();
  } catch (error) {
    return res.status(400).send('Auth token invalid');
  }
};

module.exports = authenticate;
