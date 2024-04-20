const express = require("express");
const querystring = require("querystring");
const fs = require("fs");

const client_id = require("./config.json")["client_id"];
const client_secret = require("./config.json")["client_secret"];

console.log(client_id, client_secret);

var redirect_uri = "http://localhost:8888/callback";

function generateRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const app = express();
const port = process.env.PORT || 8888;
app.use(express.json());
app.listen(port, () => console.log(`Running!\nGo to: http://localhost:${port}/login`));

app.get("/login", function (req, res) {
    var state = generateRandomString(16);
    var scope = "user-read-currently-playing user-library-modify";

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            })
    );
});

app.get("/callback", function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect(
            "/#" +
                querystring.stringify({
                    error: "state_mismatch",
                })
        );
    } else {
        response = fetch(
            "https://accounts.spotify.com/api/token?" +
                querystring.stringify({
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: "authorization_code",
                }),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + new Buffer.from(client_id + ":" + client_secret).toString("base64"),
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                fs.readFile("config.json", "utf8", (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const jsonData = JSON.parse(data);
                    jsonData.access_token = json["access_token"];
                    jsonData.refresh_token = json["refresh_token"];

                    const newData = JSON.stringify(jsonData, null, 4);

                    fs.writeFile("config.json", newData, "utf8", (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        res.status(200).send("Vous pouvez fermer cette page.");
                    });
                });
            });
    }
});
