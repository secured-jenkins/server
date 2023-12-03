import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
const app = express();
const port = process.env.PORT || 8085;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
}));

app.get("/", (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    availablePaths: [
      {
        path: "/tc-proxy",
        operation: "POST",
        description:
          "Forwards requests to Trust Commerce and appends the CORS header to the response, then passes the response back to you.",
      },
    ],
  });
});

app.post("/tc-proxy", async (req, res) => {
  const requestBody = new URLSearchParams(req.body).toString();
  console.log(requestBody);

  const targetURL = "https://vault.trustcommerce.com/trans/?";

  const response = await fetch(targetURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  });

  const responseData = await response.text();

  // Set the Access-Control-Allow-Origin header to allow all origins
  // res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(response.status).send(responseData);
});

app.use((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(404).send("This path does not exist.");
});

app.listen(port, () => {
  console.log("Listening");
});
