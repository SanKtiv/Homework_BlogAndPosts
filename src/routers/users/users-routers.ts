import {Router} from "express";
import {userInputValid} from "../../validations/users-validators";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {authMiddleware} from "../../middlewares/auth-middleware";
import {usersPaginatorDefault} from "../../middlewares/users-middleware";
import {usersController} from "../../composition-root";

export const userRouter = Router({})

userRouter.post('/',
    authMiddleware.basic.bind(authMiddleware),
    ...userInputValid,
    errorMiddleware.error.bind(errorMiddleware),
    usersController.createSuperUser.bind(usersController))

userRouter.get('/',
    authMiddleware.basic.bind(authMiddleware),
    usersPaginatorDefault,
    usersController.getUsersPaging.bind(usersController))

userRouter.delete('/:id',
    authMiddleware.basic.bind(authMiddleware),
    usersController.deleteUserById.bind(usersController))