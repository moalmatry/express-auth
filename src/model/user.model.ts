import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import log from "../utils/logger";

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  // FIXME: nanoid is making error
  @prop({ required: true, default: () => Math.random() })
  verificationCode: string;

  @prop()
  passwordRestCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error(error, "Could not validate password");

      return false;
    }
  }
}

const UserModal = getModelForClass(User);

export default UserModal;
