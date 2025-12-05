import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  // Borrow a book
  @UseGuards(AuthGuard('jwt'))
  @Post(':bookId')
  borrow(@Param('bookId') bookId: string, @Req() req: any) {
    return this.borrowService.borrowBook(+bookId, req.user.userId);
  }

  // Return a book
  @UseGuards(AuthGuard('jwt'))
  @Post('return/:bookId')
  returnBook(@Param('bookId') bookId: string, @Req() req: any) {
    return this.borrowService.returnBook(+bookId, req.user.userId);
  }

  // Get all borrowed books by a user
  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  getUserBorrowedBooks(@Param('userId') userId: string) {
    return this.borrowService.getUserBorrowedBooks(+userId);
  }
}
