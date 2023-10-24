const express = require('express')
const router = express.Router()
const userController = require('../../app/controllers/users/UserController')
const profileController = require('../../app/controllers/users/ProfileController')
const {authenticateUser, authenticateAdmin, authenticateToken} = require('../../middlewares/AuthenticateToken')

//uri /api/users
router.use(authenticateToken)

//profile
router.get('/me', authenticateUser, profileController.getProfile)
router.patch('/me/restore', authenticateUser, profileController.restoreAccount)
router.patch('/me', authenticateUser, profileController.updateProfile)
router.delete('/me', authenticateUser, profileController.deleteAccount)
//users
router.get('/', authenticateAdmin, userController.listUsers)
router.get('/:userId', authenticateAdmin, userController.detailUser)
router.post('/', authenticateAdmin, userController.addUser)
router.patch('/:userId/restore', authenticateAdmin, userController.restoreUser)
router.patch('/:userId', authenticateAdmin, userController.updateUser)
router.delete('/:userId/force', authenticateAdmin, userController.forceDeleteUser)
router.delete('/:userId', authenticateAdmin, userController.deleteUser)

module.exports = router