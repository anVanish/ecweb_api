const Category = require('../../models/Category')
const ApiResponse = require('../../utils/ApiResponse')
const ErrorCodeManager = require('../../utils/ErrorCodeManager')
const InputValidator = require('../../utils/InputValidator')

class CategoryController{
    //GET /api/categories
    async listCategories(req, res, next){
        try{
            const categories = await Category.find({})
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess()
            apiResponse.data.total = categories.length
            apiResponse.data.categories = categories
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //GET /api/categories/:categoryId
    async detailCategory(req, res, next){
        try{
            const _id = req.params.categoryId
            const category = await Category.findOne({_id})
            if (!category) throw ErrorCodeManager.CATEGORY_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess()
            apiResponse.data.category = category
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //POST /api/categories
    async addCategory(req, res, next){
        try{
            const error = InputValidator.invalidCate(req.body)
            if (error) throw error
    
            const category = new Category(req.body)
            await category.save()
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category added')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //PUT /api/categories/:categoryId
    async updateCategory(req, res, next){
        try{
            const _id = req.params.categoryId
        
            const error = InputValidator.invalidCate(req.body)
            if (error) throw error
    
            const category = await Category.findOneAndUpdate({_id}, req.body, {new: true})
            if (!category) throw ErrorCodeManager.CATEGORY_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category updated')
            apiResponse.data.category = category
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }
 
    //DELETE /api/categories/:categoryId
    async deleteCategory(req, res, next){
        try{
            const _id = req.params.categoryId
            const category = await Category.findOneAndDelete({_id})
            if (!category) throw ErrorCodeManager.CATEGORY_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Category deleted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }
}

module.exports = new CategoryController()