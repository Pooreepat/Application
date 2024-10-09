import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionCreateDto } from './dto/transactions-create.dto';
import { TransactionUpdateDto } from './dto/transactions-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetTransactionsPaginationDto from './dto/getPagination.dto';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { GetTransactionsPaginationUsecase } from './usecase/getPagination.usecase';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly getTransactionsPaginationUsecase: GetTransactionsPaginationUsecase

  ) {}

  @Post()
  @ApiOperation({ summary: 'สร้างธุรกรรมใหม่' })
  @ApiResponse({ status: 201, description: 'ธุรกรรมถูกสร้างแล้ว' })
  create(@Body() createTransactionDto: TransactionCreateDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Put(":id")
  @ApiOperation({ summary: 'อัปเดตธุรกรรม' })
  @ApiResponse({ status: 200, description: 'อัปเดตธุรกรรมสำเร็จ' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: TransactionUpdateDto
  ) {
    return this.transactionService.update(
      id,
      updateTransactionDto,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: 'ดึงข้อมูลธุรกรรมตาม ID' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลธุรกรรมสำเร็จ' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
  // GetTransactionsPaginationDto
  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetTransactionsPaginationDto,
  ): Promise<any> {
    return this.getTransactionsPaginationUsecase.execute(query, user.profile);
  }



  // @Get()
  // @ApiOperation({ summary: 'ดึงข้อมูลธุรกรรมทั้งหมด' })
  // findAll() {
  //   return this.transactionService.findAll();
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'ดึงข้อมูลธุรกรรมตาม ID' })
  // findOne(@Param('id') id: string) {
  //   return this.transactionService.findOne(id);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'อัปเดตธุรกรรมตาม ID' })
  // update(@Param('id') id: string, @Body() updateTransactionDto: TransactionUpdateDto) {
  //   return this.transactionService.update(id, updateTransactionDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'ลบธุรกรรมตาม ID' })
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(id);
  // }
}
