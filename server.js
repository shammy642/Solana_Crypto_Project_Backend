const express = require('express')
const app = express();
require('dotenv').config();

const port = process.env.APP_PORT;

app.use(express.json());

app.post("/login", (req,res) => {
    const { password } = req.body;
    const correctPassword = process.env.APP_PASSWORD;
    console.log(correctPassword)

    if (password === correctPassword) {
        res.status(200).json({ message: "Login successful"});
    } else {
        res.status(401).json({ message: "login failed"});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})