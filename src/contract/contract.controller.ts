import { Body, Controller, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ContractService } from './contract.service';
import { v4 as uuid } from 'uuid';
import { CreateContractDto, UpdateContractDto } from 'src/dto/contract.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: function(req, file, cb) {
          file.originalname = uuid() + file.originalname;
          cb(null, file.originalname)
        }
      })
    })
  )
  createContract(@Body() body: CreateContractDto, @Request() req, @UploadedFiles() files) {
    return this.contractService.createContract(body, req.headers.authorization, files);
  }

  @Post('update')
  updateContract(@Body() body: UpdateContractDto) {
    return this.contractService.updateContract(body);
  }
  
  @Get('all')
  getContract() {
    return this.contractService.getContract();
  }
}
