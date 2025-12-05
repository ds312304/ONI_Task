import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  // Create author (protected)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: { name: string; bio?: string }) {
    return this.authorsService.create(dto);
  }

  // Get all authors (public)
  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  // Get one author (public)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }

  // Update author (protected)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: { name?: string; bio?: string }) {
    return this.authorsService.update(+id, dto);
  }

  // Delete author (protected)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.delete(+id);
  }
}
