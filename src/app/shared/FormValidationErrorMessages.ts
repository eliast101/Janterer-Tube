export class FormValidationErrorMessages {
  FIRST_NAME_REQUIRED_ERROR: string = 'First Name is required';
  FIRST_NAME_MIN_LENGTH_ERROR: string = 'First Name should have a minimum of 2 characters';
  FIRST_NAME_MAX_LENGTH_ERROR: string = 'First Name should have a maximum of 25 characters';
  FIRST_NAME_NON_ALPHABET_ERROR: string = 'First Name should only contain letters';

  LAST_NAME_REQUIRED_ERROR: string = 'Last Name is required';
  LAST_NAME_MIN_LENGTH_ERROR: string = 'Last Name should have a minimum of 2 characters';
  LAST_NAME_MAX_LENGTH_ERROR: string = 'Last Name should have a maximum of 25 characters';
  LAST_NAME_NON_ALPHABET_ERROR: string = 'Last Name should only contain letters';

  USERNAME_REQUIRED_ERROR: string = 'Username is required';
  USERNAME_MIN_LENGTH_ERROR: string = 'Username should have a minimum of 4 characters';
  USERNAME_MAX_LENGTH_ERROR: string = 'Username should have a maximum of 25 characters';
  USERNAME_EXISTS: string = 'Username already exists';

  EMAIL_REQUIRED_ERROR: string = 'Email is required';
  EMAIL_PATTERN_ERROR: string = 'Email should be valid';
  EMAIL_EXISTS: string = 'Email already exists';
  EMAIL_MISMATCH_ERROR: string = 'Confirmed Email should match';

  PASSWORD_REQUIRED_ERROR: string = 'Password is required';
  PASSWORD_MIN_LENGTH_ERROR: string = 'Password should have a minimum of 6 characters';
  PASSWORD_MAX_LENGTH_ERROR: string = 'Password should have a maximum of 25 characters';
  PASSWORD_MISMATCH_ERROR: string = 'Confirmed Password should match';

  USERNAME_PASSWORD_INCORRECT: string = 'Username or Password incorrect';
}
