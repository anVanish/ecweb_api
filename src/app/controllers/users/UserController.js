const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require("../../utils/ErrorHandling")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")

class UserController{ 

    //GET /api/users
    async listUsers(req, res){
        //params all=false, deleted=true, page=1, limit=5
        let page = 1
        let limit = 10
        let search = ''

        //pagintion
        page = parseInt(req.query.page)      
        limit = parseInt(req.query.limit)
        //search
        if (req.query.search) search = req.query.search
        
        //soft deleted filters
        const all = (req.query.all === 'true')
        const deleted = (req.query.deleted === 'true')
        const pending = (req.query.pending === 'true')
        const options = {all, deleted, pending}

        const filters = {$or:[
                    {name: { $regex: `.*${search}.*`, $options: 'i' }},
                    {email: { $regex: `.*${search}.*`, $options: 'i' }},
                ]}

        try{
            const total = await Users.countUsers(filters, options)
            const users = await Users.findUsers(filters, options)
                .skip((page - 1) * limit)
                .limit(limit)
            const apiResponse = new ApiResponse()
            apiResponse.data.total = total
            apiResponse.data.length = users.length
            apiResponse.data.users = users

            res.json(apiResponse)
        } catch(error){
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //GET /api/users/:userId
    detailUser(req, res){
        const userId = req.params.userId
        Users.findOne({_id: userId})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = user
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //POST /api/users
    addUser(req, res){
        const errorRequired = InputValidator.invalidAuth(req.body)
        if (errorRequired) return ErrorHandling.handleErrorResponse(res, errorRequired)
        const errorInput = InputValidator.invalidUser(req.body)
        if (errorInput) return ErrorHandling.handleErrorResponse(res, errorInput)

        const {email} = req.body
        Users.findOne({email})
        .then((foundUser) => {
            if (foundUser) throw ErrorCodeManager.EMAIL_ALREADY_EXISTS
            const user = new Users(req.body)
            return user.save()
        })
        .then((savedUser) => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Add user successfully')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //PATCH /api/users/:userId
    updateUser(req, res){
        const _id = req.params.userId
        if (!_id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_ID, 'User Id is required')
        const errorInput = InputValidator.invalidUser(req.body)
        if (errorInput) return ErrorHandling.handleErrorResponse(errorInput)

        Users.findByIdAndUpdate(_id, req.body, {new: true})
        .then((user) => {
            if (!user) throw ErrorHandling.handleErrorResponse(res, ErrorCodeManager.USER_NOT_FOUND)

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Update successfully')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/users/:userId
    deleteUser(req, res){
        const _id = req.params.userId
        if (!_id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_ID, 'User Id is required')
        
        Users.deleteUsersById(_id, {new: true})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //PATCH /api/users/:userId/restore
    restoreUser(req, res){
        const _id = req.params.userId
        Users.findOneAndRestoreUsers({_id}, {deleted: true, new: true})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            
            const apiResponse = new ApiResponse();
            apiResponse.setSuccess('User restored')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/users/:userId/force
    forceDeleteUser(req, res){
        const _id = req.params.userId
        Users.findByIdAndDelete(_id)
        .then((user) => {
            if(!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User force deleted') 
            res.json(apiResponse)
        })
        .catch((error) => ErrorHandling.handleErrorResponse(res, error))
    }
}

module.exports = new UserController()