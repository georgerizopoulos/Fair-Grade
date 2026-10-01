import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsPositive, IsString, ValidateNested } from 'class-validator';
import { validationPipe } from './validation.pipe.js';

class CriterionDto {
  @IsString() description: string;
  @IsPositive() maxPoints: number;
}

class RubricDto {
  @IsString() questionText: string;
  @ValidateNested({ each: true })
  @Type(() => CriterionDto)
  criteria: CriterionDto[];
}

describe('validationPipe', () => {
  it('names the exact nested field in the message', async () => {
    const body = {
      questionText: 'Q',
      criteria: [
        { description: 'a', maxPoints: 3 },
        { description: 'b', maxPoints: 2 },
        { description: 'c', maxPoints: 0 },
      ],
    };
    const err = await validationPipe
      .transform(body, { type: 'body', metatype: RubricDto })
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as BadRequestException).message).toBe(
      'criteria[2].maxPoints must be a positive number',
    );
  });
});
