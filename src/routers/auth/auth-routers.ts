import {authController, authValidation, countRequestsMiddleware} from "../../composition-root";
import {Router} from "express";
import {emailPasswordRecovery, userAuthValid} from "../../validations/users-validators";
import {errorMiddleware} from "../../middlewares/errors-middleware";
import {authMiddleware} from "../../middlewares/auth-middleware";

export const authRouters = Router({})

authRouters.post('/login',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    ...userAuthValid,
    errorMiddleware.error.bind(errorMiddleware),
    authController.createAndSendAccessToken.bind(authController))

authRouters.post('/password-recovery',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    emailPasswordRecovery,
    authController.sendRecoveryCode.bind(authController))

authRouters.post('/new-password',
    countRequestsMiddleware.countRequests.bind(countRequestsMiddleware),
    authValidation.password.bind(authValidation),
    authValidation.recoveryCode.bind(authValidation),
    errorMiddleware.error.bind(errorMiddleware),
    authController.createNewPassword.bind(authController))

authRouters.post('/refresh-token',
    authMiddleware.refreshToken.bind(authMiddleware),
    authController.updateRefreshToken.bind(authController))

authRouters.post('/logout',
    authMiddleware.refreshToken.bind(authMiddleware),
    authController.deleteDeviceSession.bind(authController))

authRouters.get('/me',
    authMiddleware.accessToken.bind(authMiddleware),
    authController.getInfoCurrentUser.bind(authController))