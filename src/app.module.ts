import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { VerificationModule } from './verification/verification.module';
import { WebsocketsModule } from './gateway/websockets/websockets.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Tubongee', {
      
    }),
    JwtModule.register({
      secret: 'tshirt',
      signOptions: { expiresIn: '1ms' }, 
    }), 
    UserModule,
    AuthModule,
    ChatModule,
    
    VerificationModule,
    
    WebsocketsModule,
    
    
    
  ],
 
})
export class AppModule {}
