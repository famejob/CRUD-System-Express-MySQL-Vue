const express = require("express");
const conn = require("./config");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const customers = require("./routes/customers");
const checkunique = require("./routes/checkunique");
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use("/", customers);
app.use("/", checkunique);
app.listen(8080, () => {
  // รัน server ผ่าน port
  console.log("Start server at port 8080.");
});
