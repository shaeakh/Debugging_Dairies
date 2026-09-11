const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Debugging Diaries API',
    description:
      'REST API for the Debugging Diaries blogging platform. Supports user authentication, story management, categories, search, and user profiles.',
    version: '1.0.0',
    contact: {
      name: 'Debugging Diaries',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and account management' },
    { name: 'Users', description: 'User management' },
    { name: 'Stories', description: 'Story (blog post) operations' },
    { name: 'Categories', description: 'Story category operations' },
    { name: 'Profile', description: 'Public user profile' },
    { name: 'Search', description: 'Search users and stories' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'authToken',
        description:
          'JWT token stored in the `authToken` cookie, set automatically on sign-in or sign-up.',
      },
    },
    schemas: {
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'JavaScript' },
        },
        required: ['id', 'name'],
      },
      Story: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 42 },
          title: {
            type: 'string',
            minLength: 10,
            maxLength: 100,
            example: 'How I debugged a memory leak',
          },
          body: {
            type: 'string',
            minLength: 20,
            example: 'It all started when the server OOM-crashed at 3 AM...',
          },
          summary: {
            type: 'string',
            nullable: true,
            example: 'An account of debugging a memory leak issue.',
          },
          is_deleted: { type: 'boolean', default: false },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          deleted_at: { type: 'string', format: 'date-time', nullable: true },
          userId: { type: 'integer', example: 7 },
          categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 7 },
          username: { type: 'string', minLength: 3, example: 'shaeakh22' },
          name: { type: 'string', minLength: 3, example: 'Shaeakh Rahman' },
          email: { type: 'string', format: 'email', example: 'shaeakh22@gmail.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER' },
          join_date: { type: 'string', format: 'date-time' },
          is_active: { type: 'boolean', default: false },
          is_deleted: { type: 'boolean', default: false },
          deleted_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      UserProfile: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: {
              stories: { type: 'array', items: { $ref: '#/components/schemas/Story' } },
            },
          },
        ],
      },
      SignUpRequest: {
        type: 'object',
        required: ['username', 'name', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, example: 'shaeakh22' },
          name: {
            type: 'string',
            minLength: 3,
            example: 'Shaeakh Rahman',
            description: 'Must not contain numbers.',
          },
          email: { type: 'string', format: 'email', example: 'shaeakh22@gmail.com' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 32,
            example: 'shaeakh22@gmail.coM',
            description: 'Must contain uppercase, lowercase, number, and special character.',
          },
          role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER' },
        },
      },
      SignInRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'shaeakh22@gmail.com' },
          password: { type: 'string', example: 'shaeakh22@gmail.coM' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', example: 'OldP@ss1!' },
          newPassword: { type: 'string', example: 'NewP@ss2@' },
        },
      },
      VerifyOtpRequest: {
        type: 'object',
        required: ['type', 'code'],
        properties: {
          type: { type: 'string', enum: ['PASSWORD_RESET', 'EMAIL_VERIFICATION'] },
          code: { type: 'string', minLength: 6, maxLength: 6, example: '483920' },
        },
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'TypeScript' },
        },
      },
      CreateStoryRequest: {
        type: 'object',
        required: ['title', 'body'],
        properties: {
          title: {
            type: 'string',
            minLength: 10,
            maxLength: 100,
            example: 'My first story about Node.js',
          },
          body: {
            type: 'string',
            minLength: 20,
            example: 'Node.js is an asynchronous JavaScript runtime...',
          },
          categories: {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' },
            default: [],
          },
        },
      },
      UpdateStoryRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 10, maxLength: 100 },
          body: { type: 'string', minLength: 20 },
          summary: { type: 'string', nullable: true },
          categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3 },
          name: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          is_active: { type: 'boolean' },
          is_deleted: { type: 'boolean' },
        },
      },
      SuccessMessage: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Operation successful.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Validation error.' },
        },
      },
    },
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: 'Numeric resource ID',
      },
      PageParam: { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
      LimitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 5 },
      },
      SortByParam: { name: 'sortBy', in: 'query', schema: { type: 'string' } },
      SortOrderParam: {
        name: 'sortOrder',
        in: 'query',
        schema: { type: 'string', enum: ['asc', 'desc'] },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid authentication token.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 401, message: 'Unauthorized.' },
          },
        },
      },
      Forbidden: {
        description: 'Authenticated but not authorized to perform this action.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 403, message: 'Forbidden.' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 404, message: 'Not found.' },
          },
        },
      },
      ValidationError: {
        description: 'Request body or query params failed validation.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 422, message: 'Validation error.' },
          },
        },
      },
      Conflict: {
        description: 'Conflict — resource already exists.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 409, message: 'Username or email already taken.' },
          },
        },
      },
      InternalServerError: {
        description: 'Unexpected server error.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 500, message: 'Internal server error.' },
          },
        },
      },
    },
  },
  paths: {
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description:
          'Creates a new user account. On success, a session cookie (`authToken`) is set and a confirmation email is sent.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SignUpRequest' } },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '409': { $ref: '#/components/responses/Conflict' },
          '422': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in',
        description:
          'Authenticates an existing, active user. Sets an `authToken` HttpOnly cookie on success.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SignInRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'Sign-in successful.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/auth/confirm-email/{token}': {
      get: {
        tags: ['Auth'],
        summary: 'Confirm email address',
        description: 'Activates a user account using the JWT confirmation token sent by email.',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            description: 'Short-lived JWT (30 min) sent in the confirmation email.',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Email confirmed.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Initiate a password change',
        description: 'Verifies the current password, then generates a 6-digit OTP and emails it.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'OTP sent to email.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/auth/verify-Otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP',
        description: 'Verifies a 6-digit OTP. On PASSWORD_RESET, applies the new password.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/VerifyOtpRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'OTP verified.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        description:
          'Returns a list of all available story categories. No authentication required.',
        responses: {
          '200': {
            description: 'List of categories.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                  },
                },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a category',
        description: 'Creates a new story category.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } },
          },
        },
        responses: {
          '201': {
            description: 'Category created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Category' } },
                },
              },
            },
          },
          '422': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/stories': {
      get: {
        tags: ['Stories'],
        summary: 'Get all stories',
        description:
          'Returns a paginated list of all non-deleted stories. Requires authentication.',
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of stories.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Story' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      post: {
        tags: ['Stories'],
        summary: 'Create a story',
        description: 'Creates a new story. An AI-generated summary is automatically produced.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateStoryRequest' } },
          },
        },
        responses: {
          '201': {
            description: 'Story created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Story' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/stories/{id}': {
      get: {
        tags: ['Stories'],
        summary: 'Get a story by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Story found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Story' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Stories'],
        summary: 'Update a story',
        description: 'Only the story owner or an ADMIN may perform this action.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateStoryRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'Story updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Story' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Stories'],
        summary: 'Delete a story',
        description:
          'Hard-deletes a story. Only the story owner or an ADMIN may perform this action.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Story deleted.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Returns a paginated list of non-deleted users. Requires authentication.',
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of users.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'User found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a user',
        description: 'Only the account owner or an ADMIN may perform this action.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'User updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
          '409': { $ref: '#/components/responses/Conflict' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft-delete a user',
        description:
          'Marks a user as deleted. Only the account owner or an ADMIN may perform this action.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'User soft-deleted.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/profile/{username}': {
      get: {
        tags: ['Profile'],
        summary: 'Get user profile by username',
        description: 'Returns public profile with all stories. Requires authentication.',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string', minLength: 3, example: 'shaeakh22' },
          },
        ],
        responses: {
          '200': {
            description: 'User profile found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/UserProfile' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/search': {
      get: {
        tags: ['Search'],
        summary: 'Search users and stories',
        description:
          'Case-insensitive search across username/name and story title/body. Requires authentication.',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'search',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'node.js' },
          },
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' },
        ],
        responses: {
          '200': {
            description: 'Search results.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                        stories: { type: 'array', items: { $ref: '#/components/schemas/Story' } },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '422': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
  },
} as const;

export default swaggerDocument;
