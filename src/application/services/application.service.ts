import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from '../dto/create-application.dto';
import { ApplicationStatus, ChoiceType, Prisma } from '@prisma/client';

const SCIENTIFIC_BAC_OPTIONS = ['PC', 'SVT', 'SMA', 'SMB', 'STM', 'STE'];
const MANAGEMENT_BAC_OPTIONS = ['ECO', 'SGC'];
const CPGE_ALLOWED_BAC_OPTIONS = ['PC', 'SVT', 'SMA', 'SMB'];

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateIsmalaApplication(
    choices: CreateApplicationDto['choices'],
    userBacOption: string,
    filieres: any[],
  ) {
    // For ECO and SGC students
    if (MANAGEMENT_BAC_OPTIONS.includes(userBacOption)) {
      // Find the management filière
      const managementFiliere = filieres.find(
        (f) =>
          f.name.toLowerCase().includes('gestion') ||
          f.name.toLowerCase().includes('management'),
      );

      if (!managementFiliere) {
        throw new BadRequestException(
          'Management filière not found for ISMALA',
        );
      }

      // Validate that all choices are for the management filière
      if (choices.length !== 3) {
        throw new BadRequestException(
          'ECO and SGC students must select the management filière exactly 3 times',
        );
      }

      for (const choice of choices) {
        if (choice.filiereId !== managementFiliere.id) {
          throw new BadRequestException(
            'ECO and SGC students can only select the management filière',
          );
        }
      }
    }
    // For scientific bac options
    else if (SCIENTIFIC_BAC_OPTIONS.includes(userBacOption)) {
      // Validate that choices are different
      const uniqueFilieres = new Set(choices.map((c) => c.filiereId));
      if (uniqueFilieres.size !== choices.length) {
        throw new BadRequestException(
          'Scientific bac students must select different filières',
        );
      }
    } else {
      throw new BadRequestException(
        `Bac option ${userBacOption} is not allowed for ISMALA`,
      );
    }
  }

  private async validateCpgeApplication(
    choices: CreateApplicationDto['choices'],
    userBacOption: string,
    filieres: any[],
  ) {
    // For ECO and SGC students
    if (MANAGEMENT_BAC_OPTIONS.includes(userBacOption)) {
      // Find the ECT filière
      const ectFiliere = filieres.find(
        (f) =>
          f.name.toLowerCase().includes('ect') ||
          f.name.toLowerCase().includes('économique et commercial'),
      );

      if (!ectFiliere) {
        throw new BadRequestException('ECT filière not found for CPGE');
      }

      // Validate that all choices are for the ECT filière
      for (const choice of choices) {
        if (choice.filiereId !== ectFiliere.id) {
          throw new BadRequestException(
            'ECO and SGC students can only select the ECT filière',
          );
        }
      }
    }
    // For scientific bac options
    else if (CPGE_ALLOWED_BAC_OPTIONS.includes(userBacOption)) {
      // They can choose any filière except ECT
      const ectFiliere = filieres.find(
        (f) =>
          f.name.toLowerCase().includes('ect') ||
          f.name.toLowerCase().includes('économique et commercial'),
      );

      if (ectFiliere) {
        for (const choice of choices) {
          if (choice.filiereId === ectFiliere.id) {
            throw new BadRequestException(
              'Scientific bac students cannot select the ECT filière',
            );
          }
        }
      }
    } else {
      throw new BadRequestException(
        `Bac option ${userBacOption} is not allowed for CPGE`,
      );
    }
  }

  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { schoolId, choices } = createApplicationDto;

    // Get the school and its type to determine validation rules
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        type: true,
        bacOptionsAllowed: true,
        filieres: true,
      },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    if (!school.isOpen) {
      throw new BadRequestException('School is not open for applications');
    }

    // Get user with their bac option
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bacOption: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can create applications');
    }

    if (!user.bacOption) {
      throw new BadRequestException('Student must have a BAC option to apply');
    }

    // Check if student's bac option is allowed for this school
    const isAllowedBacOption = school.bacOptionsAllowed.some(
      (option) => option.id === user.bacOption!.id,
    );

    if (!isAllowedBacOption) {
      throw new BadRequestException(
        `Your BAC option ${user.bacOption.name} is not allowed for this school`,
      );
    }

    // Check if application already exists
    const existingApplication = await this.prisma.application.findUnique({
      where: {
        userId_schoolId: {
          userId,
          schoolId,
        },
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this school');
    }

    // Special validation for ISMALA and CPGE
    if (school.type.code === 'ISMALA') {
      await this.validateIsmalaApplication(
        choices,
        user.bacOption.name,
        school.filieres,
      );
    } else if (school.type.code === 'CPGE') {
      await this.validateCpgeApplication(
        choices,
        user.bacOption.name,
        school.filieres,
      );
    }

    // Validate choices based on school type
    await this.validateChoices(school, choices);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Create the application
        const application = await prisma.application.create({
          data: {
            userId,
            schoolId,
            status: ApplicationStatus.PENDING,
          },
        });

        // Create all choices
        await prisma.applicationChoice.createMany({
          data: choices.map((choice) => ({
            applicationId: application.id,
            rank: choice.rank,
            cityId: choice.cityId,
            filiereId: choice.filiereId,
            type: choice.type,
          })),
        });

        return this.findOne(application.id);
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create application: ' + error.message,
      );
    }
  }

  private async validateChoices(
    school: Prisma.SchoolGetPayload<{
      include: { type: true; bacOptionsAllowed: true };
    }>,
    choices: CreateApplicationDto['choices'],
  ) {
    const { type: schoolType } = school;

    // Validate number of choices
    if (choices.length === 0) {
      throw new BadRequestException('At least one choice is required');
    }

    // For schools with city ranking
    if (schoolType.requiresCityRanking) {
      if (schoolType.maxCities && choices.length > schoolType.maxCities) {
        throw new BadRequestException(
          `Maximum ${schoolType.maxCities} cities can be selected for ${school.name}`,
        );
      }

      // Validate all choices are cities
      for (const choice of choices) {
        if (choice.type !== ChoiceType.CITY) {
          throw new BadRequestException(
            'Only city choices are allowed for this school type',
          );
        }

        // Verify city exists and is associated with the school
        const citySchool = await this.prisma.school.findFirst({
          where: {
            id: school.id,
            cities: {
              some: {
                id: choice.cityId,
              },
            },
          },
        });

        if (!citySchool) {
          throw new BadRequestException(
            `City with ID ${choice.cityId} is not associated with this school`,
          );
        }
      }
    }
    // For schools with filière selection
    else if (schoolType.maxFilieres) {
      if (choices.length > schoolType.maxFilieres) {
        throw new BadRequestException(
          `Maximum ${schoolType.maxFilieres} filières can be selected for ${school.name}`,
        );
      }

      // Validate all choices are filières
      for (const choice of choices) {
        if (choice.type !== ChoiceType.FILIERE) {
          throw new BadRequestException(
            'Only filière choices are allowed for this school type',
          );
        }

        // Verify filière exists and belongs to the school
        const filiere = await this.prisma.filiere.findFirst({
          where: {
            id: choice.filiereId,
            schoolId: school.id,
          },
        });

        if (!filiere) {
          throw new BadRequestException(
            `Filière with ID ${choice.filiereId} does not belong to this school`,
          );
        }
      }

      // Check if multiple selections of the same filière are allowed
      if (!schoolType.allowMultipleFilieresSelection) {
        const uniqueFilieres = new Set(choices.map((c) => c.filiereId));
        if (uniqueFilieres.size !== choices.length) {
          throw new BadRequestException(
            'Multiple selections of the same filière are not allowed for this school',
          );
        }
      }
    }

    // Validate ranks are unique and sequential
    const ranks = choices.map((c) => c.rank);
    const uniqueRanks = new Set(ranks);
    if (uniqueRanks.size !== ranks.length) {
      throw new BadRequestException('Each choice must have a unique rank');
    }

    // Check if ranks are sequential starting from 1
    ranks.sort((a, b) => a - b);
    for (let i = 0; i < ranks.length; i++) {
      if (ranks[i] !== i + 1) {
        throw new BadRequestException(
          'Ranks must be sequential starting from 1',
        );
      }
    }
  }

  async findAll(userId: string) {
    return await this.prisma.application.findMany({
      where: { userId },
      include: {
        school: {
          include: {
            type: true,
          },
        },
        choices: {
          include: {
            city: true,
            filiere: true,
          },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        school: {
          include: {
            type: true,
          },
        },
        choices: {
          include: {
            city: true,
            filiere: true,
          },
          orderBy: {
            rank: 'asc',
          },
        },
        user: {
          include: {
            bacOption: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateStatus(id: string, updateStatusDto: UpdateApplicationStatusDto) {
    const application = await this.findOne(id);

    return await this.prisma.application.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
      include: {
        school: true,
        choices: {
          include: {
            city: true,
            filiere: true,
          },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const application = await this.findOne(id);

    if (application.userId !== userId) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    if (application.status === ApplicationStatus.REGISTERED) {
      throw new BadRequestException('Cannot delete a registered application');
    }

    await this.prisma.application.delete({
      where: { id },
    });
  }
}
