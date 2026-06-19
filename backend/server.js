const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const scanRoutes = require("./routes/scan");

app.use("/api/scan", scanRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Working" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
