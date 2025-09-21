const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", customerRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
