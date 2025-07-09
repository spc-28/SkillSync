import { IsNotEmpty } from "class-validator";


export class CreateChatDto {
    @IsNotEmpty()
    senderId: string

    @IsNotEmpty()
    receiverId: string

    @IsNotEmpty()
    message: string
    
    @IsNotEmpty()
    timestamp: string

}
