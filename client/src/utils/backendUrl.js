const env = process.env.NODE_ENV || 'development';
let backend_url;
if(env === 'development'){
  backend_url = 'http://localhost:5000/api';
}

module.exports = {
  backend_url
}
