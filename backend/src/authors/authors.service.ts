import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  // Create author
  async create(data: { name: string; bio?: string }) {
    return this.prisma.author.create({ data });
  }

  // Get all authors
  async findAll() {
    return this.prisma.author.findMany({
      orderBy: { id: 'asc' }
    });
  }

  // Get one author
  async findOne(id: number) {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  // Update author
  async update(id: number, data: { name?: string; bio?: string }) {
    return this.prisma.author.update({
      where: { id },
      data,
    });
  }

  // Delete author
async delete(id: number) {
  // Check if this author has any books
  const books = await this.prisma.book.count({
    where: { authorId: id },
  });

  if (books > 0) {
    // Send readable error to frontend
    throw new BadRequestException(
      "This author cannot be deleted because books are linked to them."
    );
  }

  return this.prisma.author.delete({
    where: { id },
  })
}
}
