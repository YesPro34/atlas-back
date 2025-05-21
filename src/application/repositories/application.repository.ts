// import { Application, ApplicationStatus, SchoolType } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
// import {
//   CreateApplicationChoiceDto,
//   CreateApplicationDto,
// } from '../dto/create-application.dto';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ApplicationRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async createApplication(data: CreateApplicationDto): Promise<Application> {
//     return await this.prisma.application.create({
//       data: {
//         userId: data.userId,
//         programGroup: data.programGroup,
//         status: ApplicationStatus.PENDING,
//       },
//     });
//   }

//   async findApplicationsByUserId(userId: string): Promise<Application[]> {
//     return await this.prisma.application.findMany({
//       where: {
//         userId,
//       },
//       include: {
//         choices: {
//           include: {
//             citySchool: {
//               include: {
//                 city: true,
//                 school: true,
//               },
//             },
//             filiere: {
//               include: {
//                 school: true,
//               },
//             },
//             specialty: true,
//           },
//           orderBy: {
//             rank: 'asc',
//           },
//         },
//       },
//     });
//   }

//   async findUserApplicationByType(
//     userId: string,
//     programGroup: SchoolType,
//   ): Promise<Application | null> {
//     return await this.prisma.application.findFirst({
//       where: {
//         userId,
//         programGroup,
//       },
//       include: {
//         choices: {
//           include: {
//             citySchool: {
//               include: {
//                 city: true,
//                 school: true,
//               },
//             },
//             filiere: {
//               include: {
//                 school: true,
//               },
//             },
//             specialty: true,
//           },
//           orderBy: {
//             rank: 'asc',
//           },
//         },
//       },
//     });
//   }

//   async addApplicationChoice(data: CreateApplicationChoiceDto): Promise<any> {
//     // Check if the rank is already used in this application
//     const existingChoice = await this.prisma.applicationChoice.findFirst({
//       where: {
//         applicationId: data.applicationId,
//         rank: data.rank,
//       },
//     });

//     if (existingChoice) {
//       // If exists, update it
//       return await this.prisma.applicationChoice.update({
//         where: {
//           id: existingChoice.id,
//         },
//         data: {
//           citySchoolId: data.citySchoolId,
//           filiereId: data.filiereId,
//           specialtyId: data.specialtyId,
//         },
//       });
//     } else {
//       // If not, create new choice
//       return await this.prisma.applicationChoice.create({
//         data: {
//           applicationId: data.applicationId,
//           rank: data.rank,
//           citySchoolId: data.citySchoolId,
//           filiereId: data.filiereId,
//           specialtyId: data.specialtyId,
//         },
//       });
//     }
//   }

//   async removeApplicationChoice(id: string): Promise<any> {
//     return await this.prisma.applicationChoice.delete({
//       where: {
//         id,
//       },
//     });
//   }

//   async finalizeApplication(id: string): Promise<Application> {
//     return await this.prisma.application.update({
//       where: {
//         id,
//       },
//       data: {
//         status: ApplicationStatus.REGISTERED,
//       },
//     });
//   }

//   async deleteApplication(id: string): Promise<any> {
//     // First delete all choices
//     await this.prisma.applicationChoice.deleteMany({
//       where: {
//         applicationId: id,
//       },
//     });

//     // Then delete the application
//     return await this.prisma.application.delete({
//       where: {
//         id,
//       },
//     });
//   }
// }
