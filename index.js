const player$ = require('./lib/player');

player$("http://87.230.53.43:7000")
    .subscribe(x => console.log(x));


// const app = require('express')();

// app.use('/api/radio/', require('./api/radio'));
// app.get('/', (req, res) => {
//     res.send("Hello");
// });

// app.listen(4747);