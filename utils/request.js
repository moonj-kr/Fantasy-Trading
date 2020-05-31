const axios = require('axios');
const querystring = require('querystring');

const getRequest = async uri => {
  try {
    return axios.get(uri, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};

const postRequest = async (uri, body) => {
  let url = uri;

  if (body) {
    const query = querystring.stringify(body);
    url += query;
  }

  try {
    return axios.post(url);
  } catch (error) {
    throw error;
  }
};

const postRequestBody = async (uri, data) => axios.post(uri, data);

module.exports = {
  getRequest,
  postRequest,
  postRequestBody
}