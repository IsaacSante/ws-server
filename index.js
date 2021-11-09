const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

console.log('server is running')

wss.on("connection", ws => {
    console.log("New Client Connected");
    ws.send('im the Heroku ws server');

  ws.on("message", data => {
    console.log(`Client has sent + ${data}`)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  })

  ws.on("close", () => {
    console.log("Client has disconnected")
  })
})