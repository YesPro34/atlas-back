import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Application, Prisma } from '@prisma/client';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportStudentApplicationsBySchool(schoolId: string): Promise<Buffer> {
    console.log('Exporting applications for schoolId:', schoolId);
    
    // First, verify if the school exists
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId }
    });
    console.log('Found school:', school?.name);

    // Check total applications in the database
    const totalApplications = await this.prisma.application.count();
    console.log('Total applications in database:', totalApplications);

    // Check applications for this school without includes
    const simpleApplications = await this.prisma.application.findMany({
      where: {
        schoolId: schoolId,
      },
    });
    console.log('Simple applications found:', simpleApplications.length);
    
    // Fetch applications with related data
    const applications = await this.prisma.application.findMany({
      where: {
        schoolId: schoolId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            massarCode: true,
            bacOption: {
              select: {
                name: true,
              },
            },
          },
        },
        school: {
          select: {
            name: true,
          },
        },
        choices: {
          include: {
            filiere: true,
            city: true,
          },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });

    console.log('Found applications with includes:', applications.length);
    if (applications.length === 0) {
      console.log('Query parameters:', {
        schoolId: schoolId,
        schoolIdType: typeof schoolId,
      });
    }

    // If no applications found, return empty Excel file with headers
    if (applications.length === 0) {
      console.log('No applications found for this school');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Student Applications');
      
      // Add headers even if no data
      worksheet.columns = [
        { header: 'Student Name', key: 'studentName', width: 30 },
        { header: 'Massar Code', key: 'massarCode', width: 20 },
        { header: 'School', key: 'school', width: 30 },
        { header: 'Bac Option', key: 'bacOption', width: 30 },
        { header: 'Choices', key: 'choices', width: 50 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Application Date', key: 'applicationDate', width: 20 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Applications');

    // Add headers
    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 30 },
      { header: 'Massar Code', key: 'massarCode', width: 20 },
      { header: 'School', key: 'school', width: 30 },
      { header: 'Bac Option', key: 'bacOption', width: 30 },
      { header: 'Choices', key: 'choices', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Application Date', key: 'applicationDate', width: 20 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    applications.forEach((application) => {
      const choices = application.choices
        .map((choice) => {
          if (choice.type === 'FILIERE') {
            return `${choice.rank}. ${choice.filiere?.name || 'N/A'}`;
          } else {
            return `${choice.rank}. ${choice.city?.name || 'N/A'}`;
          }
        })
        .join(' | ');

      worksheet.addRow({
        studentName: `${application.user.firstName} ${application.user.lastName}`,
        massarCode: application.user.massarCode,
        school: application.school.name,
        bacOption: application.user.bacOption?.name || 'N/A',
        choices: choices,
        status: application.status,
        applicationDate: application.applicationDate.toLocaleDateString(),
      });
    });

    // Auto-filter for all columns
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 7 },
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
} 