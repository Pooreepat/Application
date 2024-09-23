import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export default class UserGetDto {

    @ApiProperty({
        required: false,
        type: String,
        description: 'รหัสผู้ใช้',
    })
    @IsOptional()
    @IsString({
        message: 'รหัสผู้ใช้ต้องเป็นตัวอักษร',
    })
    _id: string;

    @ApiProperty({
        required: false,
        type: String,
        description: 'ชื่อผู้ใช้',
    })
    @IsOptional()
    @IsString({
        message: 'ชื่อผู้ใช้ต้องเป็นตัวอักษร',
    })
    username: string;

    @ApiProperty({
        required: false,
        type: String,
        description: 'อีเมล',
    })
    @IsOptional()
    @IsEmail(
        {},
        {
            message: 'อีเมลไม่ถูกต้อง',
        },
    )
    email: string;

    @ApiProperty({
        required: false,
        type: String,
        description: 'เบอร์โทรศัพท์',
    })
    @IsOptional()
    @Length(10, 10, {
        message: 'เบอร์โทรศัพท์ต้องมีความยาว 10 ตัวอักษร',
    })
    phoneNumber: string;
}
