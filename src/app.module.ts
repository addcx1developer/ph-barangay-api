import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbConfig } from './config/mongodb.config';

@Module({
  imports: [MongooseModule.forRoot(mongodbConfig.uri)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
