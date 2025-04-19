import { makeWASocket, fetchLatestBaileysVersion, DisconnectReason, Browsers, useMultiFileAuthState } from '@whiskeysockets/baileys';
import fs from 'fs';
import Pino from 'pino';
import chalk from 'chalk';
import io from 'socket.io-client'; 

const logger = Pino({ level: 'error' });

const socketServer = io('http://localhost:4521'); 

async function connectToWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_state');
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: state.keys,
      },
      version: version,
      logger: logger,
      printQRInTerminal: true,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      browser: Browsers.macOS('Chrome'),
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
        if (shouldReconnect) {
          connectToWhatsApp();
        }
      } else if (connection === 'open') {
        console.log('Connection opened successfully');
      }
    });

    sock.ev.on('creds.update', async () => {
      await saveCreds();
    });

    sock.ev.on('messages.upsert', (upsert) => {
      if (upsert.type !== 'notify') return;
      const message = upsert.messages[0];
      if (!message || message.key.fromMe) return; 

      console.log('Mensagem recebida:', message);
      socketServer.emit('new_message', { message });
      console.log('Mensagem enviada para o servidor WebSocket:', message);
    });

  } catch (error) {
    console.error('Erro ao conectar ao WhatsApp:', error);
  }
}

connectToWhatsApp();
