const http = require('http')
const fs = require('fs')
const { collect } = require('promise-streams')

const log = fs.createWriteStream('stats.log', { flags: 'a' })

const server = http.createServer(async (req, res) => {
    const body = (await collect(req)).toString()
    console.warn(req.headers)
    const { referer, "user-agent": userAgent, "x-forwarded-for": xForwardedFor } = req.headers
    const ip = xForwardedFor ? xForwardedFor.split(',')[0] : req.socket.remoteAddress
    const time = new Date().toISOString()
    log.write(JSON.stringify({ time, ip, referer, body, userAgent }) + "\n")
    res.setHeader('content-type', 'text/plain')
    res.end('ok')
})

server.listen(process.env.PORT, (err) => {
    if (err) throw err;
})
