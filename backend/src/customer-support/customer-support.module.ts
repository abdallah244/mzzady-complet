import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSupport, CustomerSupportSchema } from '../schemas/customer-support.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { CustomerSupportController } from './customer-support.controller';
import { CustomerSupportService } from './customer-support.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerSupport.name, schema: CustomerSupportSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CustomerSupportController],
  providers: [CustomerSupportService],
  exports: [CustomerSupportService],
})
export class CustomerSupportModule {}

