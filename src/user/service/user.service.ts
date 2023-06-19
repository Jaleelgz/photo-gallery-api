import { Injectable } from '@nestjs/common';
import { CRUDService } from 'src/common/service/crud.service';
import { User, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as admin from 'firebase-admin';
import { Model } from 'mongoose';
import { IDecodedIdToken } from '../interface/iDecodedIdToken';

@Injectable()
export class UserService extends CRUDService<UserDocument> {
  constructor(@InjectModel(User.name) readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async verifyToken(token: string): Promise<IDecodedIdToken> {
    return (await admin
      .auth()
      .verifyIdToken(token, true)) as unknown as IDecodedIdToken;
  }

  async updateUser(uid: string, data: any): Promise<any> {
    return await admin.auth().updateUser(uid, data);
  }

  async createUser(data: any): Promise<any> {
    return await admin.auth().createUser(data);
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await admin.auth().getUserByEmail(email);
      return user;
    } catch (e) {
      return undefined;
    }
  }

  async getUserByPhone(phone: string): Promise<any> {
    try {
      const user = await admin.auth().getUserByPhoneNumber(phone);
      return user;
    } catch (e) {
      return undefined;
    }
  }

  async deleteUser(uid: string): Promise<any> {
    return await admin.auth().deleteUser(uid);
  }

  addCustomClaims(
    uid: string,
    claims: { [key: string]: string | any },
  ): Promise<void> {
    return admin.auth().setCustomUserClaims(uid, claims);
  }
}
