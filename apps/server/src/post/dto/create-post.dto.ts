import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsNotEmpty()
    authorId: string

    @IsNotEmpty()
    content: string

    @IsOptional()
    @IsString()
    imageUrl: string = ''; 

}
