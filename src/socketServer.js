import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();
const io = new Server(server); 

io.on('connection', (socket) => {
  console.log('Novo cliente conectado!');

  socket.on('new_message', (data) => {
    console.log('Mensagem recebida do bot:', data.message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(4521, () => {
  console.log('Servidor WebSocket rodando na porta 4521');
});
