import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { publicationDto } from './dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() body: publicationDto) {
    return this.publicationsService.create(body);
  }

  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: publicationDto) {
    return this.publicationsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(+id);
  }
}
