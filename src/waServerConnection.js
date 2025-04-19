import {
    makeWASocket,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers,
    useMultiFileAuthState
  } from '@whiskeysockets/baileys';
  
  import Pino from 'pino';
  import io from 'socket.io-client';
  
  const logger = Pino({ level: 'error' });
  const socketServer = io('http://localhost:4521');
  const clientName = '[CLIENT] Gabriel WhatsApp';
  
  // Lista de comandos aceitos
  const validCommands = ['ping', 'help']; // pode adicionar mais aqui
  
  async function connectToWhatsApp() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('./auth_state');
      const { version } = await fetchLatestBaileysVersion();
  
      const sock = makeWASocket({
        auth: { creds: state.creds, keys: state.keys },
        version,
        logger,
        printQRInTerminal: true,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        browser: Browsers.macOS('Chrome'),
      });
  
      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('Connection closed:', lastDisconnect?.error, 'Reconnecting:', shouldReconnect);
          if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
          console.log('✅ Conexão com o WhatsApp aberta!');
        }
      });
  
      sock.ev.on('creds.update', saveCreds);
  
      sock.ev.on('messages.upsert', async (upsert) => {
        if (upsert.type !== 'notify') return;
        const message = upsert.messages[0];
        if (!message || message.key.fromMe) return;
  
        const userId = message.key.remoteJid;
        const textMsg = message?.message?.conversation || message?.message?.extendedTextMessage?.text;
  
        if (!textMsg || !textMsg.startsWith('!')) return;
  
        const command = textMsg.trim().slice(1).split(' ')[0].toLowerCase();
  
        if (!validCommands.includes(command)) {
          console.log(`❌ Comando não reconhecido: ${command}`);
          return;
        }
  
        console.log(`📤 Enviando comando reconhecido: ${command} do usuário ${userId}`);
  
        socketServer.emit('new_message', {
          clientName,
          message: textMsg,
          userId,
        });
  
        // Ouve a resposta do socket e envia de volta no WhatsApp
        socketServer.once('api_response', async ({ userId: responseUser, responseMessage }) => {
          if (responseUser === userId && responseMessage) {
            await sock.sendMessage(userId, { text: responseMessage });
            console.log(`📩 Resposta enviada para ${userId}: ${responseMessage}`);
          }
        });
      });
  
    } catch (error) {
      console.error('❌ Erro ao conectar ao WhatsApp:', error);
    }
  }
  
  connectToWhatsApp();
  