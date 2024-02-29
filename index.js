const app = require("./app"); // the actual Express application
const { PORT } = require("./utils/config");
const { info } = require("./utils/logger");

app.listen(PORT, () => {
  info(`Server running on port ${PORT} ayo`);
});
