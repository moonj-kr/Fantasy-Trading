const axios = require('axios');

const getRequest = async uri => {
  try {
    return await axios.get(uri, {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    });
  } catch (error) {
    throw error;
  }
};

const postRequest = async (uri, body) => {
  try {
    return await axios.post(uri, body,
    {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getRequest,
  postRequest
}
