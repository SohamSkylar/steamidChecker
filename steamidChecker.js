const SteamCommunity = require("steamcommunity");

const checkSteamID = async (req, res) => {
  try {
    const steamIDUrl = req.body.steamid;
    const steamIDBreaker = steamIDUrl.split("/");
    if (steamIDBreaker.length > 4) var steamIDRaw = steamIDBreaker[4];
    else return res.send({ msg: "WRONG_URL" });

    let regExp = /[a-zA-Z]/g;
    let community = new SteamCommunity();
    if (regExp.test(steamIDRaw)) {
      community.getSteamUser(steamIDRaw, (err, details) => {
        if (err) {
          res.send({ err: "WRONG_ID" });
        } else {
          // console.log(details);
          let newSteamID = BigInt(details.steamID.accountid);
          let steamID = `STEAM_1:${newSteamID % 2n}:${newSteamID / 2n}`;
          res.send({ steamid: steamID, profilename: details.name });
        }
      });
    } else {
      let accountID = BigInt(steamIDRaw) - 76561197960265728n;
      let SteamIDObj = SteamCommunity.SteamID;
      let newSteamID = new SteamIDObj(`[U:1:${accountID}]`);
      new Promise((resolve, reject) => {
        community.getSteamUser(newSteamID, (err, details) => {
          if (err) {
            reject(err);
          } else {
            resolve(details.name);
          }
        });
      })
        .then(
          (name) => {
            // console.log(accountID);
            if (accountID < 0n) accountID = accountID - accountID * 2n;
            let steamID = `STEAM_1:${accountID % 2n}:${accountID / 2n}`;
            res.send({ steamid: steamID, profilename: name });
          },
          (err) => {
            res.send({ msg: "WRONG_ID" });
          }
        )
        .catch((err) => {
          return res.send({ err: err });
        });
    }
  } catch (err) {
    if (err.message.includes("Unknown SteamID input format"))
      res.send({ msg: "WRONG_ID" });
    else res.send({ err: err.message });
  }
};

module.exports = checkSteamID;
