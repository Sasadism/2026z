const express = require('express');
const { WebSocketServer } = require('ws');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const db = new Database('zeus.db');
console.log('✅ SQLite Connected');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, uuid TEXT, limit_gb REAL, expiry_days INTEGER, ips TEXT, tls TEXT, port INTEGER, used_gb REAL DEFAULT 0, is_active INTEGER DEFAULT 1, last_active INTEGER, created_at TEXT, fingerprint TEXT DEFAULT 'chrome', limit_req INTEGER, used_req INTEGER DEFAULT 0, ip_limit INTEGER, active_ips TEXT, block_porn INTEGER DEFAULT 0, block_ads INTEGER DEFAULT 0, frag_len TEXT, frag_int TEXT, user_proxy_ip TEXT, user_proxy_iata TEXT, user_socks5 TEXT);
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`);

// HTML Templates - in ro az file ghabli copy kon (nginx, setup, panel, status)
const HTML_TEMPLATES = {
  nginx: `<!DOCTYPE html> ... `, // kol template ha ro paste kon
  // baqi template ha
};

// Routes (basic)
app.get('/', (req, res) => res.send(HTML_TEMPLATES.nginx || '<h1>2026z Running</h1>'));

// WebSocket
const wss = new WebSocketServer({ noServer: true });
wss.on('connection', (ws) => console.log('VLESS connected'));

const server = app.listen(PORT, () => console.log(`🚀 2026z on port ${PORT}`));

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
});
