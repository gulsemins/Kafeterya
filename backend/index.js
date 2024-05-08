import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/userModel.js";

const app = express();
app.use(cors()); // cors default olarak bütün sunuculardan gelen isteklere izin veriyor
app.use(express.json());
const PORT = process.env.PORT || 5555;
const mongoDBURL =
  "mongodb+srv://admin:admin1234@cafeteria.gjzhepm.mongodb.net/?retryWrites=true&w=majority&appName=cafeteria";

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("welcome to mern stack");
});

app.post("/api/users", async (request, response) => {
  try {
    if (!request.body.name || !request.body.password) {
      return response.status(400).send({
        message: " send all required fields: name, password",
      });
    }
    const newUser = {
      name: request.body.name,
      password: request.body.password,
    };
    const user = await User.create(newUser);
    return response.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    //find promise döndürdüğü için await olmalı
    const user = await User.findOne({ name: req.body.name });

    console.log(user);
    if (req.body.password === user.password) {
      return res.json({ message: "Login successful" });
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
    console.log("error");
  });
