const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const {
  Upload,
  SearchPolicyInfo,
  PolicyByEachUser,
  Message,
} = require('./src');

//Utils
const { checkCPUUsage } = require('./utils/CPUTracker');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

// MONGODB CONNECTION
const { MONGODB_URI, MONGO_DB_NAME, MONGODB_QUERY } = process.env;
const URI = `${MONGODB_URI}/${MONGO_DB_NAME}${MONGODB_QUERY}`;

const connect = mongoose.connect(URI);

connect
  .then(() => console.log('Connected to the Database successfully'))
  .catch((err) => {
    console.log('Unable to connect to the Database', err);
  });

// CUSTOM ROUTES
router.get('/', (req, res) => {
  res.send('Welcome To InsuredMine Assessment');
});
router.get('/search', SearchPolicyInfo);
router.get('/policy-by-users', PolicyByEachUser);
router.post('/upload', upload.single('file'), Upload);
router.post('/message', Message);

// START CHECKING CPU USAGE
// TO CHECK THE CPU USAGE UNCOMMAND THE BELOW FUNCTION AND RESTART THE SERVER
// checkCPUUsage();

app.listen(port, () => {
  console.log(`Server is running successfully in http://localhost:${port}`);
});
