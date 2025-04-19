import http from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch'; // ou 'undici' se preferir libs mais modernas

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('✅ Novo cliente conectado!');

  socket.on('new_message', async (data) => {
    const { clientName, message, userId } = data;
    console.log(`📨 ${clientName} enviou: "${message}" de ${userId}`);

    // Envia para todos os outros clientes (se quiser)
    io.emit('broadcast_message', { clientName, message });

    // Verifica se a mensagem começa com !ping
    // if (message.trim().toLowerCase().startsWith('!ping')) {
    //   try {
    //     // Chamada para sua API Java (ajuste a URL conforme necessário)
    //     const response = await fetch('http://localhost:8080/api/ping');
    //     const result = await response.text(); // ou .json() se retornar JSON

    //     // Responde via socket para o cliente WhatsApp original
    //     socket.emit('api_response', {
    //       userId,
    //       responseMessage: result || 'Pong!'
    //     });

    //     console.log(`🔁 Enviando resposta da API para ${userId}: ${result}`);
    //   } catch (error) {
    //     console.error('❌ Erro ao chamar a API:', error);
    //     socket.emit('api_response', {
    //       userId,
    //       responseMessage: 'Erro ao chamar a API Java.'
    //     });
    //   }
    // }

    if (message.trim().toLowerCase().startsWith('!ping')) {
      try {
        // Responde via socket para o cliente WhatsApp original com "Pong!"
        socket.emit('api_response', {
          userId,
          responseMessage: 'Pong!'
        });
    
        console.log(`🔁 Enviando resposta "Pong!" para ${userId}`);
      } catch (error) {
        console.error('❌ Erro ao processar comando !ping:', error);
        socket.emit('api_response', {
          userId,
          responseMessage: 'Erro ao processar o comando !ping.'
        });
      }
    }
    
  });

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado');
  });
});

server.listen(4521, () => {
  console.log('🚀 Servidor WebSocket rodando na porta 4521');
});
