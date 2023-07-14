const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const router = express.Router();

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

router.get('/', (req, res) => {
  res.send('Welcome To InsuredMine Assessment');
});

app.listen(port, () => {
  console.log(`Server is running successfully in http://localhost:${port}`);
});
