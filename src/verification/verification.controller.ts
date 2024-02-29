import { Controller, Get } from '@nestjs/common';

@Controller('verification')
export class VerificationController {
  @Get()
  generateVerificationCode(): string {
    const verificationCode = this.generateRandomNumericCode();
    return verificationCode;
  }

  generateRandomNumericCode(): string {
    const min = 1000; // Minimum value for a 4-digit number
    const max = 9999; // Maximum value for a 4-digit number
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString(); // Convert to string for response
  }
}
