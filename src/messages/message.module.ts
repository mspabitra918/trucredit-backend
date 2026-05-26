import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { MessagesController } from './message.controller';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  controllers: [MessagesController],
  providers: [MessageService],
})
export class MessagesModule {}
