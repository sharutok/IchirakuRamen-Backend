const app = require("./Ichraku");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;
const cors = require("cors");

let db = process.env.DATABASE;
db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected to db`);
  });
app.use(cors());
app.listen(PORT, () => {
  console.log(`listining to port ${PORT}`);
});
