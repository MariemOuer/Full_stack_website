require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3001;

console.log(`IS_LOADED: ${process.env.IS_LOADED || "No"}`);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
