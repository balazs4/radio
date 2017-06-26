require('mini-linq-js');
const request = require('request-promise-native');
const opmltojs = opml =>
  new Promise(resolve => {
    require('opmltojs').parse(opml, data => {
      const raw = JSON.stringify(data, null, 2);
      resolve(JSON.parse(raw));
    });
  });

(async term => {
  const opml = await request(
    `http://opml.radiotime.com/Search.ashx?query=${term}`
  );
  const json = await opmltojs(opml);
  const data = json['opml']['body']['subs']
    .where(x => x.type === 'audio')
    .where(x => x.item === 'station')
    .select(({ text, URL, image, reliability = 0 }) => ({
      text,
      image,
      score: parseInt(reliability),
      url: URL
    }))
    .orderByDescending(x => x.score);
  console.log(data);
})(process.argv[2]);
