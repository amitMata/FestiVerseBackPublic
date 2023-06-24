const axios = require("axios");

exports.getToken = async (req, res) => {
  const authParameters = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const data =
    "grant_type=client_credentials&client_id=" +
    process.env.CLIENT_ID +
    "&client_secret=" +
    process.env.CLIENT_SECRET;

  const url = "https://accounts.spotify.com/api/token";

  try {
    const response = await axios.post(url, data, authParameters);
    const accessToken = response.data.access_token;

    res.json({ accessToken });
  } catch (error) {
    console.error("Error fetching token", error);
    res.status(500).json({ error: "Error fetching token" });
  }
};

exports.getArtistData = async (req, res) => {
  const url = `https://api.spotify.com/v1/artists/${req.params.id}`;
  const headers = {
    headers: {
      Authorization: "Bearer " + req.params.token,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(url, headers);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist data", error);
    res.status(500).json({ error: "Error fetching artist data" });
  }
};

exports.searchArtist = async (req, res) => {
  const url = `https://api.spotify.com/v1/search`;
  const headers = {
    headers: {
      Authorization: "Bearer " + req.params.token,
      "Content-Type": "application/json",
    },
  };
  const params = {
    q: req.params.name,
    type: "artist",
    limit: 1,
  };

  try {
    const response = await axios.get(url, {
      headers: headers.headers,
      params: params,
    });
    const artistId = response.data.artists.items[0].id;
    res.json({ artistId: artistId });
  } catch (error) {
    console.error("Error searching for artist", error);
    res.status(500).json({ error: "Error searching for artist" });
  }
};
