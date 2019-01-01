const request = require('request-promise-native');
const opmltojs = opml =>
  new Promise(resolve => {
    require('opmltojs').parse(opml, data => {
      const raw = JSON.stringify(data, null, 2);
      resolve(JSON.parse(raw));
    });
  });

const search = async term => {
  const opml = await request(
    `http://opml.radiotime.com/Search.ashx?query=${term}`
  );
  const json = await opmltojs(opml);
  const data = json['opml']['body']['subs']
    .filter(x => x.type === 'audio')
    .filter(x => x.item === 'station')
    .map(({ text, URL, image, reliability = 0 }) => ({
      text,
      image,
      score: parseInt(reliability),
      url: URL
    }))
    .sort((a, b) => b.score - a.score);
  return data;
};

module.exports = {
  search
};
