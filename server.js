const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(
	fileUpload({
		useTempFiles: true,
	})
);

readdirSync('./routes').map((route) => app.use('/api', require('./routes/' + route)));

// database
mongoose.set('strictQuery', false);
mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('database connected successfully.'))
	.catch((error) => console.log(`Error connectiong to mongodb ${error}`));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
