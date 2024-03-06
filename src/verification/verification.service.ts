import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
  generateVerificationCode(): string {
    const code = Math.floor(1000 + Math.random() * 9000);
    return code.toString();
  }
}
