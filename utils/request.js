const axios = require('axios');
const querystring = require('querystring');

export const getRequest = async uri => {
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

export const postRequest = async (uri, body) => {
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

export const postRequestBody = async (uri, data) => axios.post(uri, data);
