import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Tubongee', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    }),
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }), // Configure JwtModule here
    UserModule,
    AuthModule,
    ChatModule,
    VerificationModule,
  ],
})
export class AppModule {}
