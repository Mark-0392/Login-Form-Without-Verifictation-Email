const notFound = (req, res) =>
  res.status(404).send(`<h1>The route you are looking for doesn't exist</h1>`)

module.exports = notFound
