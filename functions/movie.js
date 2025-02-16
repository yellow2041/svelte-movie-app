const axios = require("axios");
const { OMDB_API_KEY } = process.env;

exports.handler = async function (event, context) {
  const params = JSON.parse(event.body);

  const { title, type, year, page, id } = params;

  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`;

  try {
    const response = await axios.get(url);
    if (response.data.Error) {
      return {
        statusCode: 400,
        body: response.data.Error,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error.response);
    return {
      statusCode: error.response.status,
      body: error.message,
    };
  }
};
