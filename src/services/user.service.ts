import UserModal, { User } from "../model/user.model";

export const createUser = (input: Partial<User>) => {
  return UserModal.create();
};
