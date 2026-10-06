require("dotenv").config({ path: require("node:path").join(__dirname, ".env") });
const app = require("../server");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectDB()
	.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
	.catch((err) => {
		console.error(`MongoDB connection error: ${err.message}`);
		process.exit(1);
	});
