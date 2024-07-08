const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const hello = require('./routes/hello');
const { exec } = require('child_process');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use('/', hello);

// GET /health
app.get('/health', (_, res) => {
  return res.status(200).send('OK');
});

// Apply migrations
exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
  if (err) {
    console.error(`Migration error: ${stderr}`);
    process.exit(1);
  } else {
    console.log(`Migration success: ${stdout}`);
    sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    });
  }
});