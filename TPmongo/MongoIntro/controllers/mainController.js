const path = require('path');

module.exports = {
  first: (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public','html', 'first.html'));
  },
  second: (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public','html', 'second.html'));
  },
  json: (req, res) => {
    // Remplacez ceci par le JSON que vous souhaitez envoyer
    const data = { key: 'value' };
    res.json(data);
  },
  jsonRandom: (req, res) => {
    const randomData = { randomNumber: Math.random() };
    res.json(randomData);
  },
};
