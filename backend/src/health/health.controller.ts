import { Controller, Get } from '@nestjs/common';

// API_SPEC #1. Always 200 so the frontend can tell "backend down" apart from
// "backend up, database unreachable".
@Controller('health')
export class HealthController {
  @Get()
  check() {
    // No database yet (Checkpoint B wires Prisma in), so report it as unreachable.
    return { status: 'ok', database: 'error' };
  }
}
