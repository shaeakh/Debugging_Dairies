const MessageConstants = {
  validation: {
    id: 'ID must be a number',
    username: {
      minimumLength: 'Username must be at least 3 characters',
    },
    name: {
      minimumLength: 'Username must be at least 3 characters',
      containsNumber: 'Name must not contain numbers',
    },
    email: 'Not a valid Email',
    password: {
      minimumLength: 'Password must be at least 8 characters',
      maximumLength: 'Password must be at max 32 characters',
      containsUpperCase: 'Password must contain at least one uppercase letter',
      containsLowerCase: 'Password must contain at least one lowercase letter',
      containsNumber: 'Password must contain at least one number',
      containsSpecialCharacter: 'Password must contain at least one special character',
    },
    role: "User role can't be anything except 'USER' or 'ADMIN'",
    //story
    storyId: 'Not a valid story Id',
    storyTitle: {
      min: 'Title must be at least 10 characters long',
      max: 'Title cannot exceed 100 characters',
    },
    storyBody: {
      min: 'Story body must be at least 20 characters long',
    },
    categoryName: 'Category must be string type',
  },
  responseMessage: {
    userController: {
      userRemoved: 'User removed successfully',
    },
    storyController: {
      storyRemoved: 'Story removed successfully',
    },
    authController: {
      userCreationSuccessfull: 'User creation successfull. Confirm your email',
      emailConfirmationSuccessfull: 'Email Confirmation Successfull',
      signInSuccessful: 'Sign In Successful',
      ChangePassword: 'Confirmation code hasbeen sent on your email',
      VerifyOtp: 'OTP verification Successful',
      Logout: 'Logout Successful',
    },
    categoryController: {},
  },
  errorMessage: {
    userService: {
      userNotfound: 'User not found',
      userAlreadyExists: 'User already exists',
    },
    storyService: {
      storyNotFound: 'Story not found',
    },
    authService: {
      userNotfound: 'User not found',
      failedToCreateUser: 'Failed to create user',
      failedToCreateAuthRecord: 'Failed to create auth record',
      invalidCredential: 'Invalid Credential',
      userNotFound: 'User Not found',
      canOnlyConfirmOwnEmail: 'You can only confirm your email',
      failedToConfirmUser: 'Failed to confirm user',
      bothUsernameAndEmailTaken: 'Both username and email are already taken',
      usernameTaken: 'Username is already taken',
      emailTaken: 'Email is already taken',
    },
  },
};

export default MessageConstants;
