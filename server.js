const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const STATIC_DIR = __dirname;

function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMessage(msg) {
  const messages = readMessages();
  messages.push(msg);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
  };
  return types[ext] || "application/octet-stream";
}

function serveStatic(res, filePath) {
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const content = fs.readFileSync(safePath);
    res.writeHead(200, { "Content-Type": getContentType(safePath) });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Nao encontrado</h1>");
  }
}

function parseBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const params = new URLSearchParams(body);
    const data = {};
    for (const [key, value] of params) {
      data[key] = value;
    }
    callback(data);
  });
}

function sendEmailAlert(name, email, message) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      personalizations: [{ to: [{ email: process.env.TO_EMAIL || "juliabarrioswork@gmail.com" }] }],
      from: { email: process.env.FROM_EMAIL || "juliabarrioswork@gmail.com" },
      subject: `Nova mensagem do portfolio - ${name}`,
      content: [
        {
          type: "text/plain",
          value: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
        },
      ],
    });

    const options = {
      hostname: "api.sendgrid.com",
      path: "/v3/mail/send",
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.SENDGRID_API_KEY,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        console.log("SendGrid:", res.statusCode, body);
        resolve(res.statusCode);
      });
    });
    req.on("error", (err) => {
      console.log("SendGrid erro:", err.message);
      resolve(0);
    });
    req.write(payload);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/contact") {
    parseBody(req, async (data) => {
      const { name, email, message } = data;

      if (!name || !email || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "All fields are required." }));
        return;
      }

      const entry = {
        name,
        email,
        message,
        date: new Date().toISOString(),
      };

      saveMessage(entry);
      await sendEmailAlert(name, email, message);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: "Message sent successfully!" }));
    });
    return;
  }

  let filePath = path.join(STATIC_DIR, req.url === "/" ? "index.html" : req.url);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Mensagens salvas em ${MESSAGES_FILE}`);
});
