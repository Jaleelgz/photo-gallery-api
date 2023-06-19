import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { AuthToken } from '../decorators/authToken.decorator';
import { IDecodedIdToken } from '../interface/iDecodedIdToken';
import { UserAuthGuard } from '../guards/userAuth.guard';
import { SignUpRequestDTO } from '../dto/request/signUpRequest.dto';
import { UserService } from '../service/user.service';
import { SignUpNInResponseDTO } from '../dto/response/signInResponse.dto';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: SignUpNInResponseDTO })
  @Post('sign_up')
  @UseGuards(UserAuthGuard)
  async signUpUser(
    @Body() body: SignUpRequestDTO,
    @AuthToken() token: IDecodedIdToken,
  ): Promise<any> {
    try {
      if (!(token.email || token.phone_number || token.phone)) {
        throw new BadRequestException('email/phone missing');
      }

      const userExistAggregation = `[
          {
            $match: {
              $or: [{ phone: '${
                token.phone_number ? token.phone_number : body.phone
              }' }, { email: '${token.email ? token.email : body.email}' }]
            },
          },
        ]`;

      const userExistRes = await this.userService.groupedList(
        userExistAggregation,
      );

      if (!userExistRes) {
        throw new BadRequestException();
      }

      if (userExistRes.length > 0) {
        // check if exist
        throw new BadRequestException('Email/Phone exist');
      }

      // delete firebase user
      if (token.phone_number && !token.email) {
        const existFirebaseUser = await this.userService.getUserByEmail(
          body.email,
        );

        if (existFirebaseUser?.uid) {
          await this.userService.deleteUser(existFirebaseUser.uid);
        }
      } else if (token.email && !token.phone_number) {
        const existFirebaseUser = await this.userService.getUserByPhone(
          body.phone,
        );

        if (existFirebaseUser?.uid) {
          await this.userService.deleteUser(existFirebaseUser.uid);
        }
      }

      // create user profile
      const userRes = await this.userService.create({
        ...body,
        phone: token.phone_number ? token.phone_number : body.phone,
        email: token.email ? token.email : body.email,
      });

      if (!userRes) {
        // delete firebase user
        await this.userService.deleteUser(token.uid);
        throw new BadRequestException('Failed to create user');
      }

      await this.userService.updateUser(
        token.uid,
        token.phone_number
          ? { email: body.email, emailVerified: true }
          : {
              phoneNumber: body.phone,
              emailVerified: true,
            },
      );

      const resCustom = await this.userService.addCustomClaims(token.uid, {
        userId: userRes._id ? userRes._id : userRes.id,
      });

      return {
        userToken: token.userToken,
        name: userRes.name,
        phone: userRes.phone,
        email: userRes.email,
        userId: userRes._id ? userRes._id : userRes.id,
        address: userRes.address,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @ApiResponse({ type: SignUpNInResponseDTO })
  @Post('sign_in')
  @UseGuards(UserAuthGuard)
  async signInUser(@AuthToken() token: IDecodedIdToken): Promise<any> {
    try {
      if (!token.userId) {
        throw new NotFoundException('User does not exist.');
      }

      const userRes = await this.userService.get(
        { _id: token.userId },
        null,
        null,
        null,
      );

      if (!userRes) {
        throw new NotFoundException('User does not exist.');
      }

      return {
        userToken: token.userToken,
        name: userRes.name,
        phone: userRes.phone,
        email: userRes.email,
        userId: userRes._id ? userRes._id : userRes.id,
        address: userRes.address,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @ApiResponse({ type: SignUpNInResponseDTO })
  @Post('profile')
  @UseGuards(UserAuthGuard)
  async getUserProfile(
    @AuthToken() token: IDecodedIdToken,
  ): Promise<SignUpNInResponseDTO> {
    try {
      if (!token.userId) {
        throw new NotFoundException('User does not exist.');
      }

      const userRes = await this.userService.get(
        { _id: token.userId },
        null,
        null,
        null,
      );

      if (!userRes) {
        throw new NotFoundException('User does not exist.');
      }

      return {
        userToken: token.userToken,
        name: userRes.name,
        phone: userRes.phone,
        email: userRes.email,
        userId: userRes._id ? userRes._id : userRes.id,
        address: userRes.address,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
