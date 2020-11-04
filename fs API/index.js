const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
app.use(express.json());
const port = process.env.PORT || 5000;

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

const loaddata = () => {
  try {
    const dataBuffer = fs.readFileSync("data.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const savedata = (data) => {
  const dataJSON = JSON.stringify(data);
  fs.writeFileSync("data.json", dataJSON);
};

app.post("/postdata", (req, res) => {
  const id = req.params.id;
  let a;

  try {
    a = loaddata();
    a.push(req.body);

    savedata(a);
    res.send(req.body);
  } catch (e) {
    console.log(e);
  }
});

app.get("/getdata/:id", (req, res) => {
  const id = req.params.id;
  let a;

  try {
    a = loaddata();
    var x = a.filter((city) => city.id == id);
    res.send(x);
  } catch (e) {
    console.log(e);
  }
});

app.post("/postbalance", async (req, res) => {
  const id = req.body.id;
  const address = req.body.address;
  const amt = req.body.amt;

  let a;
  let x = [];
  try {
    a = loaddata();

    for (let i = 0; i < a.length; i++) {
      if (a[i].beneficaryaddress == address && a[i].id == id) {
        a[i].amount = amt;
        x.push(a[i]);
      } else {
        x.push(a[i]);
      }
    }
    savedata(x);
    res.send(x);
  } catch (e) {
    res.send(e);
  }
});

app.listen(port, () => {
  console.log("the app is running on locahost " + port);
});
