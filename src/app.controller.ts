import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/get-data')
  getSrapeData(@Query('url') url: string) {
    return this.appService.scrapeData(url);
  }
}
