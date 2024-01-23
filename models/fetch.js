const axios = require("axios");

async function fetchDataWithAuthentication() {
  try {
    // Replace 'YOUR_ACCESS_TOKEN' with your actual GitHub access token
    const accessToken = process.env.GITHUB_TOKEN;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      "https://api.github.com/repos/babyo7/NGl--Database/contents/data.json",
      { headers }
    );

    const content = response.data.content;
    const decode = Buffer.from(content, "base64").toString("utf-8");
    const data = JSON.parse(decode);

    return data;
  } catch (error) {
    return error.message
    console.error("Error fetching data:", error.message);
  }
}

module.exports = fetchDataWithAuthentication;
