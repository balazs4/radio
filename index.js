const app = require('express')();
app.use(require('cors')());
app.use('/api/radio/', require('./api/radio'));
app.get('/', (req, res) => res.send("Hello"));
app.listen(4747);
