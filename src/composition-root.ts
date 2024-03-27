import {BlogsRepository} from "./repositories/mongodb-repository/blogs-mongodb/blogs-command-mongodb";
import {BlogsService} from "./services/blogs-service";
import {PostsRepository} from "./repositories/mongodb-repository/posts-mongodb/posts-command-mongodb";
import {BlogsQueryRepository} from "./repositories/mongodb-repository/blogs-mongodb/blogs-query-mongodb";
import {PostsQueryRepository} from "./repositories/mongodb-repository/posts-mongodb/posts-query-mongodb";
import {CommentsRepository} from "./repositories/mongodb-repository/comments-mongodb/comments-command-mongodb";
import {CommentsQueryRepository} from "./repositories/mongodb-repository/comments-mongodb/comments-query-mongodb";
import {UsersQueryRepository} from "./repositories/mongodb-repository/users-mongodb/users-query-mongodb";
import {UsersRepository} from "./repositories/mongodb-repository/users-mongodb/users-command-mongodb";
import {DeviceSessionQueryRepository} from "./repositories/mongodb-repository/user-sessions-mongodb/user-session-query-mongodb";
import {DeviceSessionRepository} from "./repositories/mongodb-repository/user-sessions-mongodb/user-session-mongodb";
import {ApiRequestRepository} from "./repositories/mongodb-repository/api-request-repository/count-request-mongodb";
import {PostsService} from "./services/posts-service";
import {UsersService} from "./services/users-service";
import {CommentsService} from "./services/comments-service";
import {AuthService} from "./services/auth-service";
import {ApiRequestService} from "./services/count-request-service";
import {DeviceSessionService} from "./services/device-session-service";
import {JwtService} from "./applications/jwt-service";
import {BlogsHandler} from "./routers/blogs/blog-handlers";
import {PostsHandler} from "./routers/posts/post-handler";
import {CommentsHandler} from "./routers/comments/comments-handlers";
import {UsersHandler} from "./routers/users/users-handlers";
import {EmailAdapter} from "./adapters/mail-adapter";
import {EmailValidation} from "./validations/confirmation-code-validator";
import {AuthValidation} from "./validations/recovery-password-validators";
import {SecurityHandler} from "./routers/security/security-handler";
import {CountRequestsMiddleware} from "./middlewares/count-api-request-middleware";
import {BlogsController} from "./routers/blogs/blogs-controller";
import {PostsController} from "./routers/posts/posts-controller";
import {CommentsController} from "./routers/comments/comments-controller";
import {SecurityDevicesController} from "./routers/security/devices-controller";
import {UsersController} from "./routers/users/users-controller";
import {AuthController} from "./routers/auth/auth-controller";
import {MailController} from "./routers/mail/mail-controller";
import {DeleteAllController} from "./routers/testing/all-data-controller";

const blogsRepository = new BlogsRepository()
const blogsRepositoryQuery = new BlogsQueryRepository()
const postsRepository = new PostsRepository()
const postsQueryRepository = new PostsQueryRepository()
const commentsRepository = new CommentsRepository()
const commentsQueryRepository = new CommentsQueryRepository()
const usersQueryRepository = new UsersQueryRepository()
const usersRepository = new UsersRepository()
const deviceSessionQueryRepository = new DeviceSessionQueryRepository()
const deviceSessionRepository = new DeviceSessionRepository()
const apiRequestRepository = new ApiRequestRepository()

const jwtService = new JwtService()
const authService = new AuthService(usersQueryRepository, usersRepository)
const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(postsRepository)
const usersService = new UsersService(usersRepository, authService)
const commentsService = new CommentsService(commentsRepository)
const apiRequestService = new ApiRequestService(apiRequestRepository)
const deviceSessionService = new DeviceSessionService(deviceSessionRepository, jwtService)
const emailAdapter = new EmailAdapter(usersQueryRepository, authService)

const blogsHandler = new BlogsHandler()
const postsHandler = new PostsHandler()
const commentsHandler = new CommentsHandler()
const usersHandler = new UsersHandler()
const securityHandler = new SecurityHandler()

//VALIDATIONS
export const emailValidation = new EmailValidation(authService)
export const authValidation = new AuthValidation(authService)

//MIDDLEWARE
export const countRequestsMiddleware = new CountRequestsMiddleware(apiRequestService)

// CONTROLLERS
export const blogsController = new BlogsController(
    blogsService,
    blogsRepositoryQuery,
    blogsHandler,
    postsService,
    postsHandler,
    postsQueryRepository,
    jwtService)

export const postsController = new PostsController(
    blogsRepositoryQuery,
    postsService,
    commentsService,
    commentsHandler,
    postsQueryRepository,
    postsHandler,
    jwtService,
    commentsQueryRepository)

export const usersController = new UsersController(
    usersService,
    usersHandler,
    usersQueryRepository
)

export const commentsController = new CommentsController(
    commentsQueryRepository,
    jwtService,
    commentsHandler,
    commentsService
)

export const authController = new AuthController(
    authService,
    jwtService,
    deviceSessionService,
    emailAdapter
)

export const mailController = new MailController(
    usersService,
    emailAdapter,
    authService
)

export const deleteAllController = new DeleteAllController(
    blogsService,
    postsRepository,
    usersRepository,
    commentsRepository,
    apiRequestRepository,
    deviceSessionRepository
)

export const securityDevicesController = new SecurityDevicesController(
    jwtService,
    deviceSessionQueryRepository,
    securityHandler,
    deviceSessionService
)