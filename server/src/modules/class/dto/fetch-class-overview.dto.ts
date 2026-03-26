import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for fetching the overview of a class, including its ID, a brief description, and counts of students and events associated with the class.
 */

export class FetchClassOverviewRequestDto {
  @ApiProperty({
    example: '123',
    description: 'Unique identifier of the class to fetch overview for',
  })
  @IsNotEmpty({ message: 'Class ID is required' })
  @IsString({ message: 'Class ID must be a string' })
  classId: string;
}

/**
 * DTO representing the overview details of a class, including its ID, a brief description, and counts of students and events associated with the class.
 */
class ClassOverviewDto {
  @ApiProperty({
    example: '123',
    description: 'Unique identifier of the class',
  })
  classId: string;

  @ApiProperty({
    example: 'This is a class about computer science.',
    description: 'Brief description about the class',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'About must be a string' })
  about: string | null;

  @ApiProperty({
    example: 30,
    description: 'Number of students enrolled in the class',
  })
  studentsCount: number;

  @ApiProperty({
    example: 5,
    description: 'Number of events associated with the class',
  })
  eventsCount: number;
}

export class FetchClassOverviewDataDto {
  @ApiProperty({
    description: 'Detailed information about the class',
  })
  class: ClassOverviewDto | null;
}

export class FetchClassOverviewResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Class overview fetched successfully',
    description: 'A message describing the result of the request',
  })
  message: string;

  @ApiProperty({
    description: 'The data payload containing the class overview details',
    type: FetchClassOverviewDataDto,
  })
  data: FetchClassOverviewDataDto;
}
