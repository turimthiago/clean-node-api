import {
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from "@/data/usecases/account/authentication/db-authentication-protocols";
import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { AccountModel } from "@/domain/models/account";
import { AddAccountParams } from "@/domain/usecases/account/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
export class AccountMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository {
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role
        },
        { role: "admin" }
      ]
    });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken: token
        }
      }
    );
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    return MongoHelper.map(result.ops[0]);
  }
}
