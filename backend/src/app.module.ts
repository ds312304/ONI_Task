import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // makes env vars available everywhere
    }),
    AuthModule, 
    UsersModule, 
    AuthorsModule, BooksModule, BorrowModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
