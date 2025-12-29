import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class PaginatedResponseDTO<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
