# Insecure Ethereum P2P Proxy

This is a stupid simple WebSocket proxy written in Node to facilitate
direct communication between two peers based on some kind of address. The IP
address does not need to be known to the peers.

It is intended to be used for development of off-chain Ethereum distributed
applications to send messages between clients.

In the future, a service provided by the Ethereum network, Whisper, can be used
instead. This is why this proxy has no security features whatsoever, because
these will be solved by using Whisper automatically.

What this proxy __does__:

- Accept client WebSocket connections
- Accept `register` message, argument `{address: 'something'}`, to register a
  client by its address
- Accept `send` message, argument `{to: 'something', payload: obj}`, to send
  any message to another client based on its address
  - When the proxy receives a `send` message, it relays the message to the recipient
    using a `receive` message.

In a diagram:

    ┌──────────┐  -- register -->  ┌─────────┐  <-- register --  ┌──────────┐
    │ Client 1 │                   │  Proxy  |                   | Client 2 |
    └──────────┘  ---- send ---->  └─────────┘  --- receive -->  └──────────┘

What this proxy __does not__:

- Verify addresses
- Check that address is only registered once
- Verify messages
- Be fail-proof against all sorts of attacks

__Only use this for development!__

## Usage

    npm install
    npm start

Check out the tests for a connection example, or visit `localhost:8090/test.html`
for an interactive in-browser test.

The port defaults to 8090, but can configure it in `index.js`.

## Tests

    npm test
