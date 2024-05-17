import { Body, Controller, Get, Post, Query, Request, Res, StreamableFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

import { CreateContractDto, UpdateContractDto } from 'src/dto/contract.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ContractService } from './contract.service';
import removeSpaces from 'src/utils/removeSpaces';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

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
          file.originalname = uuid();
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

  @Get('create-pdf')
  async createPDF(@Query('uuid') uuid: string, @Res() res: Response) {
    const fileName = await this.contractService.createPDF(uuid);

    if(fileName.message) {
      res.send(fileName);
    } else {
      const file = await createReadStream(join(process.cwd(), `./pdf/${fileName.fileName}`));
      file.pipe(res);
    }
  }  
}
