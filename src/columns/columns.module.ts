import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Col } from './column.model';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  imports: [TypeOrmModule.forFeature([Col])]
})
export class ColumnsModule {}
