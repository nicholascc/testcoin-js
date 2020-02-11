const TCP = require('libp2p-tcp')
const multiaddr = require('multiaddr')
const pipe = require('it-pipe')
const { collect } = require('streaming-iterables')

async function run() {
  // A simple upgrader that just returns the MultiaddrConnection
  const upgrader = {
    upgradeInbound: maConn => maConn,
    upgradeOutbound: maConn => maConn
  }

  const tcp = new TCP({ upgrader })

  const listener = tcp.createListener((socket) => {
    console.log('new connection opened')
    pipe(
      ['hello'],
      socket
    )
  })

  const addr = multiaddr('/ip4/127.0.0.1/tcp/9090')
  await listener.listen(addr)
  console.log('listening')

  const socket = await tcp.dial(addr)
  const values = await pipe(
    socket,
    collect
  )
  console.log(`Value: ${values.toString()}`)

  // Close connection after reading
  await listener.close()
}

run()
