const env = process.env.NODE_ENV || 'development';
let backend_url;
let alpha_api_key = '5EDZ5BZ8UBWSWBFJ';
let alpha_search_endpoint = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH';
if(env === 'development'){
  backend_url = 'http://localhost:5000/api';
}

module.exports = {
  backend_url,
  alpha_api_key,
  alpha_search_endpoint
}
