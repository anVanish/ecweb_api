
const express = require('express')
const router = express.Router()
const addressController = require('../../app/controllers/addresses/AddressController')
const adminAddressController = require('../../app/controllers/addresses/AdminAddressController')
const {authenticateUser, authenticateAdmin, authenticateToken} = require('../../middlewares/authentication')

//uri /api/addresses
router.use(authenticateToken)

//profile
router.get('/default/me', authenticateUser, addressController.getMyDefaultAddress)
router.get('/:addressId/me', authenticateUser, addressController.getMyAddress)
router.put('/:addressId/me', authenticateUser, addressController.updateMyAddress)
router.delete('/:addressId/me', authenticateUser, addressController.deleteMyAddress)

//admin
router.use(authenticateAdmin)
router.get('/default/:userId', adminAddressController.getDefaultAddress)
router.get('/:addressId/:userId', adminAddressController.getAddress)
router.put('/:addressId/:userId', adminAddressController.updateAddress)
router.delete('/:addressId/:userId', adminAddressController.deleteAddress)



module.exports = router
