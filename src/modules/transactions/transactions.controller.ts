import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionCreateDto } from './dto/transactions-create.dto';
import { TransactionUpdateDto } from './dto/transactions-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post()
  // @ApiOperation({ summary: 'สร้างธุรกรรมใหม่' })
  // @ApiResponse({ status: 201, description: 'ธุรกรรมถูกสร้างแล้ว' })
  // create(@Body() createTransactionDto: TransactionCreateDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

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
