import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { UsersModule } from './users/users.module.js';
import { LeaveTypesModule } from './leave-types/leave-types.module.js';
import { LeaveTypeCriteriaModule } from './leave-type-criteria/leave-type-criteria.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LeaveApplicationsModule } from './leave-applications/leave-applications.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
  type: 'oracle',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  serviceName: process.env.DB_SERVICE, 

  autoLoadEntities: true,
  synchronize: false,
  logging: true,

  retryAttempts: 30,
  retryDelay: 5000,

  extra: {
    connectTimeout: 60000,
  },
}),


    UsersModule,
    AuthModule,
    LeaveApplicationsModule,
    LeaveTypesModule,
    LeaveTypeCriteriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
