import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Create book
  async create(data: { title: string; isbn?: string; authorId: number }) {
    return this.prisma.book.create({ data });
  }

  // List books with optional filters
  async findAll(filters: { authorId?: number; isBorrowed?: boolean; search?: string }) {
    const { authorId, isBorrowed, search } = filters;

    return this.prisma.book.findMany({
      where: {
        AND: [
          authorId ? { authorId } : {},
          typeof isBorrowed === 'boolean' ? { isBorrowed } : {},
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { isbn: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: {
        author: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // Get one book
  async findOne(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  // Update book
  async update(id: number, data: any) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  // Delete book
  async delete(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
