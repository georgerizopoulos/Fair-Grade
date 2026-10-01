import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

// Global validation for every @Body() and @Query() DTO. Write a DTO class with
// class-validator decorators and invalid input becomes a 400 VALIDATION_ERROR
// whose message names the exact field, e.g. "criteria[2].maxPoints must be a
// positive number". Unknown fields are stripped.
//
// For nested objects/arrays put @ValidateNested({ each: true }) and
// @Type(() => ChildDto) on the field, or the children are not checked.
export const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) =>
    new BadRequestException(flatten(errors).join('; ')),
});

function flatten(errors: ValidationError[], parent = ''): string[] {
  return errors.flatMap((err) => {
    const path = !parent
      ? err.property
      : /^\d+$/.test(err.property)
        ? `${parent}[${err.property}]`
        : `${parent}.${err.property}`;

    // class-validator messages start with the bare property name; swap in the full path.
    const own = Object.values(err.constraints ?? {}).map((msg) =>
      msg.startsWith(err.property)
        ? path + msg.slice(err.property.length)
        : `${path}: ${msg}`,
    );
    return [...own, ...flatten(err.children ?? [], path)];
  });
}
