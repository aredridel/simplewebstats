const http = require('http')
const fs = require('fs')
const { collect } = require('promise-streams')

const log = fs.createWriteStream('stats.log', { flags: 'a' })

const server = http.createServer(async (req, res) => {
    const body = (await collect(req)).toString()
    const { referer, "user-agent": userAgent } = req.headers
    log.write(JSON.stringify({ _t: Date.now(), referer, body, userAgent }) + "\n")
    res.setHeader('content-type', 'text/plain')
    res.end('ok')
})

server.listen(process.env.PORT, (err) => {
    if (err) throw err;
})
