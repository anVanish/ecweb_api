const express = require('express')
const router = express.Router()
const categoryController = require('../../app/controllers/categories/CategoryController')
const {authenticateToken, authenticateAdmin} = require('../../middlewares/authentication')

//no auth
router.get('/', categoryController.listCategories)
router.get('/:categoryId', categoryController.detailCategory)

//admin
router.use(authenticateToken)
router.use(authenticateAdmin)
router.post('/', categoryController.addCategory)
router.put('/:categoryId', categoryController.updateCategory)
router.delete('/:categoryId', categoryController.deleteCategory)


module.exports = router