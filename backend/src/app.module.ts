import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';
import { UsersModule } from './users/users.module.js';

// Entities
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { Establishment } from './entities/establishment.entity.js';
import { LeaveType } from './entities/leave-type.entity.js';
import { Leave } from './entities/leave.entity.js';
import { LeaveApprovalFlow } from './entities/leave-approval-flow.entity.js';
import { Users } from './entities/users.entity.js';
import { ServiceMembersReport } from './entities/service-members-report.entity.js';
import { LeaveTypeCriteria } from './entities/leave-type-criteria.entity.js';
import { LeaveApplication } from './entities/leave-application.entity.js';
import { EstablishmentAdmins } from './entities/estb-admins.entity.js';
import { LeaveApplicationForExternalForwarding } from './entities/leave-application-for-external-forwarding.entity.js';
import { LeaveApplicationToBeApprovedOrRejected } from './entities/leave-applications-tobe-approved-or-rejected.entity.js';
import { LeaveTypesModule } from './leave-types/leave-types.module.js';
import { LeaveTypeCriteriaModule } from './leave-type-criteria/leave-type-criteria.module.js'; // ✅ FIXED
import { AuthModule } from './auth/auth.module.js';
import { LeaveApplicationsModule } from 'leave-applications/leave-applications.module';

@Module({
  imports: [
    LeaveApplicationsModule,
    AuthModule,
    // NotificationsModule,
    // NotificationsModule,
    // AuthService,
    // AuthController,
    // TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,  
      password: process.env.DB_PASS,
      serviceName: process.env.DB_SERVICE,
      entities: [
        Role,
        User,
        Establishment,
        Leave,
        LeaveApprovalFlow,
        LeaveType,
        Users,
        ServiceMembersReport,
        LeaveTypeCriteria,
        LeaveApplication,
        EstablishmentAdmins,
        LeaveApplicationForExternalForwarding,
        LeaveApplicationToBeApprovedOrRejected
      ],
      synchronize: false,
    }),
    UsersModule,
    LeaveTypesModule,
    LeaveTypeCriteriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
