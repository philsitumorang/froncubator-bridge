## install
npm install froncubator-bridge

## requires
Yout should install "mongoose": "5.2.4". Because current version mongoose of Froncubator Bridge, save state of models and connect models to admin panel.

```javascript
const express = require('express');
const app = express();

// set static path to show uploaded files in admin panel
app.use('/admin/static/uploads', express.static(`${__dirname}/uploads`))

// connect models before init froncubator bridge module
require('./models/user');
require('./models/post');

// init froncubator bridge
// after that, you can open "HOST/admin" in your browser.
// when your open "/admin" first time, you can create "superadmin" account

require('froncubator-bridge')(app, {
  uploadDir: `${__dirname}/uploads`,
  logsDir: `${__dirname}/logs`,
  mongo: {
    models: `${__dirname/models}`,
    url: 'mongo://127.0.0.1',
    port: 27017,
    dbName: process.env.mongodbName,
    user: process.env.mongodbUser,
    pass: process.env.mongodbPass,
    auth: true
  } 
});

app.listen(3000);
```
