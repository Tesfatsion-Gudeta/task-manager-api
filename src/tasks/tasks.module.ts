import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
