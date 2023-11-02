const express = require('express')
const router = express.Router()
const userController = require('../../app/controllers/users/UserController')
const profileController = require('../../app/controllers/users/ProfileController')
const addressController = require('../../app/controllers/addresses/AddressController')
const adminAddressController = require('../../app/controllers/addresses/AdminAddressController')
const {authenticateUser, authenticateAdmin, authenticateToken} = require('../../middlewares/authentication')

//uri /api/users
router.use(authenticateToken)

//profile
router.get('/me', authenticateUser, profileController.getProfile)
router.patch('/me/restore', authenticateUser, profileController.restoreAccount)
router.patch('/me', authenticateUser, profileController.updateProfile)
router.delete('/me', authenticateUser, profileController.deleteAccount)
router.get('/me/addresses', authenticateUser, addressController.getMyAddresses)
router.post('/me/addresses', authenticateUser, addressController.addMyAddress)

//users
router.get('/', authenticateAdmin, userController.listUsers)
router.get('/:userId', authenticateAdmin, userController.detailUser)
router.get('/:userId/addresses', authenticateAdmin, adminAddressController.getAddresses)
router.post('/:userId/addresses', authenticateAdmin, adminAddressController.addAddress)
router.post('/', authenticateAdmin, userController.addUser)
router.patch('/:userId/restore', authenticateAdmin, userController.restoreUser)
router.patch('/:userId', authenticateAdmin, userController.updateUser)
router.delete('/:userId/force', authenticateAdmin, userController.forceDeleteUser)
router.delete('/:userId', authenticateAdmin, userController.deleteUser)



module.exports = router