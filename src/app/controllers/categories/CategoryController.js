const Category = require('../../models/Category')
const ApiResponse = require('../../utils/ApiResponse')
const ErrorCodeManager = require('../../utils/ErrorCodeManager')
const InputValidator = require('../../utils/InputValidator')
const ErrorHandling = require('../../utils/ErrorHandling')

class CategoryController{
    //GET /api/categories
    listCategories(req, res){
        Category.find({})
        .then((categories) => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = categories.length
            apiResponse.data.categories = categories
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/categories/:categoryId
    detailCategory(req, res){
        const _id = req.params.categoryId
        Category.findOne({_id})
        .then((category)=>{
            if (!category) throw ErrorCodeManager.CATEGORY_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.category = category
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //POST /api/categories
    addCategory(req, res){
        const error = InputValidator.invalidCate(req.body)
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        const category = new Category(req.body)
        category.save()
        .then(() => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category added')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //PUT /api/categories/:categoryId
    updateCategory(req, res){
        const _id = req.params.categoryId
        
        const error = InputValidator.invalidCate(req.body)
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Category.findOneAndUpdate({_id}, req.body, {new: true})
        .then((updatedCategory) => {
            if (!updatedCategory) throw ErrorCodeManager.CATEGORY_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category updated')
            apiResponse.data.updatedCategory = updatedCategory
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
 
    //DELETE /api/categories/:categoryId
    deleteCategory(req, res){
        const _id = req.params.categoryId
        Category.findOneAndDelete({_id})
        .then((category) => {
            if (!category) throw ErrorCodeManager.CATEGORY_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
}

module.exports = new CategoryController()