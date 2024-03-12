import { Injectable } from '@nestjs/common';
import { count } from 'console';

@Injectable()
export class VerificationService {
  generateVerificationCode(): string {
    const code = Math.floor(1000 + Math.random() * 9000);
     console.log('code:',code);
    return code.toString();
  }
}
