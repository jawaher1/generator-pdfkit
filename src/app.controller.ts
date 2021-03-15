import { Controller, Get, Response  } from '@nestjs/common';
import { AppService } from './app.service';
import { Response as Res } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/pdf')
  async getPDF(
    @Response() res: Res,
  ): Promise<void> {
    const buffer = await this.appService.generatePDF()

    res.end(buffer)
  }
}
