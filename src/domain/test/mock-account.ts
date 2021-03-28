import { AccountModel, AddAccountParams } from "@/data/usecases/account/add-account/db-add-account-protocols";
import { AuthenticationParams } from "@/data/usecases/account/authentication/db-authentication-protocols";

export const mockAddAccountParams = (): AddAccountParams => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password"
});

export const mockAddAccountWithTokenParams = (): AddAccountParams =>
  Object.assign({}, mockAddAccountParams(), { accessToken: "any_token" });

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: "any_id",
    password: "hashed_password"
  });

export const mockAuthentication = (): AuthenticationParams => ({
  email: "any_email@mail.com",
  password: "any_password"
});
