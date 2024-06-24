import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/userModel.js";
import session from "express-session";

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:65125" })); // cors default olarak bütün sunuculardan gelen isteklere izin veriyor
app.use(express.json());
const PORT = process.env.PORT || 5555;
const mongoDBURL =
  "mongodb+srv://admin:admin1234@cafeteria.gjzhepm.mongodb.net/?retryWrites=true&w=majority&appName=cafeteria";

app.use(
  //bunun amacı req.session kullanmak çünkü istek geldiğindde ve yolladığında onu parse eden kod burda
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, //bu başta true yapmıştım ama sadece https den gelen cookieleri kabul ettiği için (benimki http) cookieleri göndermedi
    },
  })
);

//authentication middleware, check if user session has a name. obtained from login
function isAuthenticated(req, res, next) {
  if (req.session.name) next();
  else res.status(401).json({ error: "user is not logged in" });
}

app.get("/api/myName", isAuthenticated, (req, res) => {
  res.json({ message: "hello " + req.session.name });
  // return res.status(234).send("welcome to mern stack");
});

app.post("/api/users", async (req, res) => {
  try {
    if (!req.body.name || !req.body.password) {
      return res.status(400).send({
        message: " send all required fields: name, password",
      });
    }
    const newUser = {
      name: req.body.name,
      password: req.body.password,
    };
    const user = await User.create(newUser);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    //find promise döndürdüğü için await olmalı
    const user = await User.findOne({ name: req.body.name });

    console.log(user);
    if (req.body.password === user.password) {
      req.session.name = req.body.name; // store user name in session, doğru şekilde login yapınca  sessionda kaydediyoruz
      req.session.save((err) => {
        return res.json({ message: "Login successful" });
      });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    // findOne error yaptı bulamadığı için başta return yapmadığın için istek yollamaya devam ediyordu o yüzden return status yaptık.
    console.log("login error");
    return res.status(404).json({ message: "user not found" });
  }
});
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(` App is listening to port: ${PORT}`);
    });
    // express serverım  app database bağlandığında çalışsın istedim bu yüzden app.listeni bunun içinde yazdım
  })
  .catch((error) => {
    console.log("error: " + error);
  });
