import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teste')
  getTest() {
    return 'Rota teste';
  }

  @Post('/teste')
  createTest() {
    return 'Rota post funcionando';
  }
}
