const polka = require('polka');
const request = require('request-promise-native');
const kifli = require('kifli');

const { search } = require('.');

const cors = (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  next();
};

const postbody = (req, res, next) => {
  if (req.method !== 'POST') {
    next();
    return;
  }
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(body);
    next();
  });
};

const { PORT = 3999, BROKER = 'localhost' } = process.env;
polka()
  .use(cors, postbody)
  .get('/search/:term', async (req, res) => {
    const { term } = req.params;
    console.log(term);
    const result = await search(term);
    res.end(JSON.stringify(result));
  })
  .post('/play', async (req, res) => {
    const { url, text } = req.body;
    const channel = await request(url);
    const client = await kifli(BROKER, {
      clientId: 'radio-server'
    });
    await client.publish('/jukebox/control', { command: 'stop' }, { qos: 2 });
    await client.publish(
      '/jukebox/control',
      {
        command: 'loadfile',
        args: [channel.trim()]
      },
      { qos: 2 }
    );
    await client.end();
    res.statusCode = 202;
    res.end(`Streaming...${text}`);
  })
  .listen(PORT)
  .then(_ => console.log(`Server is listening on localhost:${PORT}`));
