import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {PrismaModule} from './PrismaModule';
import {HealthController} from '../controllers/HealthController';

@Module({
    imports: [
        TerminusModule,
        PrismaModule,
    ],
    controllers: [HealthController],
})
export class HealthModule {}