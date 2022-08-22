export class User {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  email2?: string;
  password?: string;
  password2?: string;

  constructor(firstName?: string, lastName?: string, username?: string, email?: string, password?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
