import { LoadAccountByEmailRepository } from "../../../../../data/authentication/db-authentication-protocols";
import { AddAccountRepository } from "../../../../../data/protocols/db/add-account-repository";
import { AccountModel } from "../../../../../domain/models/account";
import { AddAccountModel } from "../../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
export class AccountMongoRepository
implements AddAccountRepository, LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    return MongoHelper.map(result.ops[0]);
  }
}
