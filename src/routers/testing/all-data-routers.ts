import {Router} from "express";
import {deleteAllController} from "../../composition-root";

export const dellAllRouter = Router ({})

dellAllRouter.delete('/', deleteAllController.deleteAll.bind(deleteAllController))