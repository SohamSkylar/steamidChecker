const express = require("express");
const checkSteamID = require("./steamidChecker");
const app = express();

app.use(express.json({ limit: "50mb" }));

const PORT = 8000;

app.use("/", checkSteamID);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
