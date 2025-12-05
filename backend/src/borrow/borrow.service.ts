import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowService {
  constructor(private prisma: PrismaService) {}

  // Borrow a book
  async borrowBook(bookId: number, userId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) throw new BadRequestException('Book does not exist');
    if (book.isBorrowed) throw new BadRequestException('Book is already borrowed');

    // 1. Mark book as borrowed
    await this.prisma.book.update({
      where: { id: bookId },
      data: { isBorrowed: true },
    });

    // 2. Create borrow record
    return this.prisma.borrowRecord.create({
      data: {
        bookId,
        userId,
      },
    });
  }

  // Return a book
  async returnBook(bookId: number, userId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) throw new BadRequestException('Book does not exist');
    if (!book.isBorrowed) throw new BadRequestException('Book is not borrowed');

    // Check if this user borrowed the book
    const borrowRecord = await this.prisma.borrowRecord.findFirst({
      where: {
        bookId,
        userId,
        returnedAt: null,
      },
    });

    if (!borrowRecord) throw new BadRequestException('You did not borrow this book');

    // 1. Mark book as returned
    await this.prisma.book.update({
      where: { id: bookId },
      data: { isBorrowed: false },
    });

    // 2. Update borrow record
    return this.prisma.borrowRecord.update({
      where: { id: borrowRecord.id },
      data: { returnedAt: new Date() },
    });
  }

  // List user's borrowed books
  async getUserBorrowedBooks(userId: number) {
    return this.prisma.borrowRecord.findMany({
      where: { userId },
      include: {
        book: true,
      },
    });
  }
}
