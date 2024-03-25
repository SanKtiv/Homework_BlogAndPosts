import {UserSessionTypeDB} from "../../types/security-device-types";

export class SecurityHandler {

    getDeviceSessionsViewModel(deviceSessions: UserSessionTypeDB[]) {

        const deviceSessionsViewModel = []

        for (const deviceSession of deviceSessions) {

            const deviceSessionsView = {
                ip: deviceSession.ip,
                title: deviceSession.title,
                deviceId: deviceSession._id.toString(),
                lastActiveDate: deviceSession.lastActiveDate
            }

            deviceSessionsViewModel.push(deviceSessionsView)
        }

        return deviceSessionsViewModel
    }
}

// export const securityHandler = new SecurityHandler()