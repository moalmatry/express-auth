import UserModal, { User } from "../model/user.model";

export const createUser = (input: Partial<User>) => {
  return UserModal.create(input);
};

export const findUserById = (id: string) => {
  return UserModal.findById(id);
};

export const findUserByEmail = (email: string) => {
  return UserModal.findOne({ email });
};
