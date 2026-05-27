import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messages: MessageService) {}

  @Post() // user can send general meesage to the tuba media team
  async create(@Body() dto: CreateMessageDto) {
    const message = await this.messages.create(dto);
    return {
      ok: true,
      message: 'We received your inquiry.',
      data: message,
    };
  }

  @Get() // show all the message to the TruCredit team
  @UseGuards(RolesGuard)
  async list(
    @Query('inquiryType') inquiryType?: string,
    @Query('date') date?: string,
  ) {
    return this.messages.findAll({ inquiryType, date });
  }

  @Get(':id') // show all the message to the TruCredit team by their id
  @UseGuards(RolesGuard)
  async one(@Param('id') id: string) {
    return this.messages.findOne(id);
  }
}
