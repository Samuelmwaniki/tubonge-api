import { Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  generateVerificationCode(): { code: string } {
    const code = this.verificationService.generateVerificationCode();
    // You can save this code to associate it with the user and send it via email or SMS
    return { code };
  }
}
