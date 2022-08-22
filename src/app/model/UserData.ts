import {User} from "./User";

export class UserData extends User {
  id?: number;
  registerDate?: string;
  profileImage?: string;

  constructor(user?: User, encryptedPassword?: string, profileImage?: string, id?: number) {
    if (!user) {
      user = new User();
    }
    super(user.firstName, user.lastName, user.username, user.email, encryptedPassword);
    this.profileImage = profileImage;
    this.id = id;
    this.registerDate = new Date().toISOString();
  }
}
