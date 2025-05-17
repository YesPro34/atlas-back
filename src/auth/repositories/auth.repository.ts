// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class AuthRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async createSession(userId: string, token: string, expiresAt: Date) {
//     return await this.prisma.session.create({
//       data: {
//         userId,
//         token,
//         expiresAt,
//       },
//     });
//   }

//   async findSessionByUserId(userId: string) {
//     return await this.prisma.session.findFirst({
//       where: {
//         userId,
//       },
//     });
//   }

//   async updateSession(sessionId: string, token: string, expiresAt: Date) {
//     return await this.prisma.session.update({
//       where: {
//         id: sessionId,
//       },
//       data: {
//         token,
//         expiresAt,
//       },
//     });
//   }

//   async deleteSessionsByUserId(userId: string) {
//     return await this.prisma.session.deleteMany({
//       where: {
//         userId,
//       },
//     });
//   }
// }
