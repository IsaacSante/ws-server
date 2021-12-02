const WebSocket = require("ws");
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const isJSON = (message) => {
  try {
    const obj = JSON.parse(message);
    return obj && typeof obj === "object";
  } catch (err) {
    return false;
  }
};

console.log("server is running");

wss.on("connection", (ws) => {
  console.log("New Client Connected");
  ws.send("im the Heroku ws server");

  ws.on("message", (data) => {
    console.log(`Client has sent + ${data}`);
    if (isJSON(data)) {
      console.log("Json incoming");
      //let currData = JSON.parse(data);
      console.log(JSON.parse(data));
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    } else if (typeof data === "string") {
      console.log("Recognized as string");
      console.log(`New String: + ${data}`);
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    } else {
      try {
        data = data.toString();
        console.log(`New String: + ${data}`);
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});
