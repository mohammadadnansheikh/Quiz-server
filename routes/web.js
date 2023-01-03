
import express from 'express';
import AdminControllers from '../controllers/adminControllers.js';
import UserController from '../controllers/userControllers.js';


const router = express.Router();


router.get('/', (req, res)=>{
    res.send("Home page")
})
// user controller
router.get('/register', UserController.registration);
router.post('/login', UserController.login)
router.post('/register', UserController.registerUserDoc);
router.get('/user', UserController.verifyToken, UserController.getUser);
router.get('/refresh', UserController.refreshToken, UserController.verifyToken, UserController.getUser);
router.post('/logout', UserController.verifyToken, UserController.logout)

// admin controller
router.get('/admin', AdminControllers.admin);
router.get('/admin/:id', AdminControllers.getQuizById)
router.post('/admin',AdminControllers.createAdminDoc)

export default router;