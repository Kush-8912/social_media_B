import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js";
import { getNotifications } from "../controllers/notification.controllers.js";



const notificationRoutes = express.Router();


notificationRoutes.get('/getAllNotifications' ,isAuthenticated , getNotifications )




export default notificationRoutes;
