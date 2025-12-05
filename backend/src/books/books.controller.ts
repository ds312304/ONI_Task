import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Create book (Auth required)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: { title: string; isbn?: string; authorId: number }) {
    return this.booksService.create(dto);
  }

  // List all books with filters
  @Get()
  findAll(
    @Query('authorId') authorId?: string,
    @Query('isBorrowed') isBorrowed?: string,
    @Query('search') search?: string,
  ) {
    return this.booksService.findAll({
      authorId: authorId ? +authorId : undefined,
      isBorrowed: isBorrowed ? isBorrowed === 'true' : undefined,
      search,
    });
  }

  // Get book by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  // Update book (Auth required)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.booksService.update(+id, dto);
  }

  // Delete book (Auth required)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.delete(+id);
  }
}
