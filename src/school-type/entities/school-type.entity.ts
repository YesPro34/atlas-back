export class SchoolType {
  id: string;
  name: string;
  code: string;
  maxCities: number | null;
  requiresCityRanking: boolean;
  maxFilieres: number | null;
  allowMultipleFilieresSelection: boolean;
  createdAt: Date;
  updatedAt: Date;
} 