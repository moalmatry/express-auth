import UserModal, { User } from "../model/user.model";

export const createUser = (input: Partial<User>) => {
  return UserModal.create(input);
};

export const findUserById = async (id: string) => {
  return UserModal.findById(id);
};

export const findByEmail = async (email: string) => {
  return UserModal.findOne({ email });
};
