// // src/application/application.service.ts
// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import {
//   CreateApplicationDto,
//   UpdateApplicationStatusDto,
// } from '../dto/create-application.dto';

// @Injectable()
// export class ApplicationService {
//   constructor(private prisma: PrismaService) {}

//   async create(createApplicationDto: CreateApplicationDto) {
//     const { userId, schoolId, citySchoolChoices, filiereChoices } =
//       createApplicationDto;

//     // Get the school type to determine which application flow to use
//     const school = await this.prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { type: true },
//     });

//     if (!school) {
//       throw new NotFoundException('School not found');
//     }

//     // Check if student exists and get bac option
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: { bacOption: true, role: true },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     if (user.role !== 'STUDENT') {
//       throw new BadRequestException('Only students can create applications');
//     }

//     const studentBacOption = user.bacOption;
//     if (!studentBacOption) {
//       throw new BadRequestException('Student must have a BAC option to apply');
//     }

//     // Check if application already exists
//     const existingApplication = await this.prisma.application.findUnique({
//       where: {
//         userId_schoolId: {
//           userId,
//           schoolId,
//         },
//       },
//     });

//     if (existingApplication) {
//       throw new BadRequestException(
//         'Student has already applied to this school',
//       );
//     }

//     try {
//       // Start a transaction
//       return await this.prisma.$transaction(async (prisma) => {
//         // Create the base application
//         const application = await prisma.application.create({
//           data: {
//             userId,
//             schoolId,
//             status: 'PENDING',
//             applicationDate: new Date(),
//           },
//         });

//         // Handle city-based school choices (ENSA, ENCG, ENSAM)
//         if (['ENSA', 'ENCG', 'ENSAM'].includes(school.type)) {
//           if (!citySchoolChoices || citySchoolChoices.length === 0) {
//             throw new BadRequestException(
//               'City school choices are required for this school type',
//             );
//           }

//           // Validate that student's BAC option is allowed for this school type
//           const schoolDetails = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { bacOptionsAllowed: true },
//           });

//           if (!schoolDetails?.bacOptionsAllowed.includes(studentBacOption)) {
//             throw new BadRequestException(
//               `Your BAC option ${studentBacOption} is not allowed for this school type.`,
//             );
//           }

//           // Verify all citySchools belong to the selected school
//           for (const choice of citySchoolChoices) {
//             const citySchool = await prisma.citySchool.findUnique({
//               where: { id: choice.villeEcoleId },
//               select: { schoolId: true },
//             });

//             if (!citySchool || citySchool.schoolId !== schoolId) {
//               throw new BadRequestException(
//                 `City-school with ID ${choice.villeEcoleId} does not belong to the selected school.`,
//               );
//             }
//           }

//           // Create city school choices
//           await prisma.applicationChoice.createMany({
//             data: citySchoolChoices.map((choice) => ({
//               applicationId: application.id,
//               citySchoolId: choice.villeEcoleId,
//               rank: choice.rank,
//             })),
//           });
//         }
//         // Handle filière-based school choices (ISPITS, ISPM, ISMALA, etc.)
//         else if (['ISPITS', 'ISPM', 'ISMALA', 'ISSS'].includes(school.type)) {
//           if (!filiereChoices || filiereChoices.length === 0) {
//             throw new BadRequestException(
//               'Filière choices are required for this school type',
//             );
//           }

//           // For each filière choice, check if student's BAC option is allowed
//           for (const choice of filiereChoices) {
//             const filiere = await prisma.filiere.findUnique({
//               where: { id: choice.filiereId },
//               select: { bacOptionsAllowed: true, schoolId: true },
//             });

//             // Ensure filière belongs to the selected school
//             if (!filiere || filiere.schoolId !== schoolId) {
//               throw new BadRequestException(
//                 `Filière with ID ${choice.filiereId} does not belong to the selected school.`,
//               );
//             }

//             // Check if student's BAC option is allowed for this filière
//             if (!filiere.bacOptionsAllowed.includes(studentBacOption)) {
//               throw new BadRequestException(
//                 `Your BAC option ${studentBacOption} is not allowed for filière ID: ${choice.filiereId}.`,
//               );
//             }
//           }

//           // Create filière choices
//           await prisma.applicationChoice.createMany({
//             data: filiereChoices.map((choice) => ({
//               applicationId: application.id,
//               filiereId: choice.filiereId,
//               rank: choice.rank,
//             })),
//           });
//         } else {
//           throw new BadRequestException(
//             "Invalid application: The school type doesn't have a supported application flow.",
//           );
//         }

//         return {
//           message: 'Application submitted successfully',
//           applicationId: application.id,
//         };
//       });
//     } catch (error) {
//       // Since we're using $transaction, we don't need to manually delete the application
//       // on error as the transaction will be rolled back
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       throw new BadRequestException(
//         'Failed to create application: ' + error.message,
//       );
//     }
//   }

//   async findAllByStudent(userId: string) {
//     return this.prisma.application.findMany({
//       where: { userId },
//       include: {
//         school: {
//           select: {
//             id: true,
//             name: true,
//             type: true,
//           },
//         },
//         choices: {
//           include: {
//             citySchool: {
//               include: {
//                 city: true,
//                 school: {
//                   select: {
//                     name: true,
//                   },
//                 },
//               },
//             },
//             filiere: true,
//           },
//           orderBy: {
//             rank: 'asc',
//           },
//         },
//       },
//     });
//   }

//   async updateStatus(id: string, updateStatusDto: UpdateApplicationStatusDto) {
//     const application = await this.prisma.application.findUnique({
//       where: { id },
//     });

//     if (!application) {
//       throw new NotFoundException('Application not found');
//     }

//     await this.prisma.application.update({
//       where: { id },
//       data: { status: updateStatusDto.status },
//     });

//     return { message: 'Application status updated successfully' };
//   }
// }
