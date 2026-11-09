import { Body, Controller, Post, Get, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { fogDto } from './fog.dto.js';
import { title } from 'process';
import fs from 'node:fs'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App'
    }
  }

  @Get('foglalas')
  @Render('foglalas')
  getFoglalas() {
      return {
        title: 'Foglalás', 
        erList: [] ,
        success: false
      }
  }

  @Post('foglalas')
  @Render('foglalas')
  postFoglalas(@Body() body: fogDto) {

    let erList: string[] = []

    if(body.name === "") {
      erList.push('A név helytelen!')
    }
    if(!/^.{1,}@.{1,}$/.test(body.email)) {
      erList.push('Az email cím nem felel meg a formázási követelménynek!')
    }
    
    let d1 = new Date
    let most = d1.getTime
    let d2 = body.datum
    let rogzitett = d2.getTime

    if(!body.datum) {
      erList.push('A dátumot kötelező megadni!')
    } else if (most > rogzitett) {
      erList.push('A dátum nem lehet korábbi a jelenlegi dátumnál!')
    }

    if (body.nezokSzam > 10 || body.nezokSzam < 1) {
      erList.push('A nézők számát kötelező megadni!')
    } else if (body.nezokSzam < 1 || body.nezokSzam > 10) {
      erList.push('A nézők száma helytelen! \nHelyes formátum 1 és 10 között.')
    }

    if (erList.length > 0) {
      return {
        body,
        title: 'Foglalás',
        erList, 
        success: false
      }
    }
    else {
      const content: fogDto = {
        name: body.name, 
        email: body.email, 
        datum: body.datum, 
        nezokSzam: Number(body.nezokSzam)
      }
      fs.writeFileSync('./public/ujadat.json', JSON.stringify(content), 'utf-8')

      return {
      title: 'Foglalás',
      erList: [], 
      success: true
    }
    } 
  }
}
