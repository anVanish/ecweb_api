const express = require('express')
const router = express.Router()
const userController = require('../../app/controllers/UserController')
const profileController = require('../../app/controllers/ProfileController')
const {authenticateUser, authenticateAdmin, authenticateToken} = require('../../middlewares/AuthenticateToken')

router.use(authenticateToken)
//uri api/users
router.get('/me', authenticateUser, profileController.getProfile)
router.post('/me', authenticateUser, profileController.registerSeller)
router.patch('/me', authenticateUser, profileController.updateProfile)
router.delete('/me', authenticateUser, profileController.deleteAccount)

router.get('/', authenticateAdmin, userController.listUsers)
router.get('/:userId', authenticateAdmin, userController.detailUser)
router.post('/', authenticateAdmin, userController.addUser)
router.patch('/:userId', authenticateAdmin, userController.updateUser)
router.delete('/:userId', authenticateAdmin, userController.deleteUser)

module.exports = router