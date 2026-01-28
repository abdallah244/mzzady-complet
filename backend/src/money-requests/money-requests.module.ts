import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyRequest, MoneyRequestSchema } from '../schemas/money-request.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { MoneyRequestsController } from './money-requests.controller';
import { MoneyRequestsService } from './money-requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MoneyRequest.name, schema: MoneyRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MoneyRequestsController],
  providers: [MoneyRequestsService],
  exports: [MoneyRequestsService],
})
export class MoneyRequestsModule {}

