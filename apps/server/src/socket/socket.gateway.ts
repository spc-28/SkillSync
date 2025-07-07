import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io'
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

@WebSocketGateway(8001, { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly socketService: SocketService) { }

	@WebSocketServer()
	server: Server

	handleConnection(@ConnectedSocket() client: Socket) {
		const userId = String(client.handshake.query.userId);
		this.socketService.addToMap(client.id, userId);
		console.log(userId);
	}

	@SubscribeMessage('chat')
	handleChat(@ConnectedSocket() client: Socket, @MessageBody() message: CreateChatDto) {
		this.socketService.create(message);
		const receiverId = this.socketService.getFromMap(message.receiverId);
		const senderId = this.socketService.getFromMap(message.senderId);
		const content = message.message;
		console.log(receiverId + "\n" + senderId);
		if (receiverId && senderId) {

			this.server.to(receiverId).emit('receive_chat', {
				from: message.senderId,
				message: content,
			});

		}
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; userId: string }) {
		client.join(data.room);
		console.log(`User ${data.userId} joined room ${data.room}`);
		this.server.to(data.room).emit('userJoined', {
			message: `User ${data.userId} has joined the room.`,
		});
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(
		@MessageBody() data: { room: string; message: string; sender: string; timestamp: string },
	) {
		const user = await this.socketService.findUserName(data.sender);
		console.log(data);
		this.server.to(data.room).emit('newMessage', {
			sender: data.sender,
			message: data.message,
			senderName: String(user)
		});
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.socketService.removeFromMap(client.id)
		console.log("-" + client.id);
	}
}