
const express = require('express')
const router = express.Router()
const addressController = require('../../app/controllers/addresses/AddressController')
const adminAddressController = require('../../app/controllers/addresses/AdminAddressController')
const {authenticateUser, authenticateAdmin, authenticateToken} = require('../../middlewares/AuthenticateToken')

//uri /api/addresses
router.use(authenticateToken)

//profile
router.get('/:addressId/me', addressController.getMyAddress)
router.put('/:addressId/me', addressController.updateMyAddress)
router.delete('/:addressId/me', addressController.deleteMyAddress)

//admin
router.get('/:addressId/:userId', adminAddressController.getAddress)
router.put('/:addressId/:userId', adminAddressController.updateAddress)
router.delete('/:addressId/:userId', adminAddressController.deleteAddress)



module.exports = router
