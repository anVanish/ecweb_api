const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")

class UserController{ 

    //GET /api/users
    async listUsers(req, res, next){
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
            next(error)
        }
    }

    //GET /api/users/:userId
    async detailUser(req, res, next){
        const userId = req.params.userId
        try{
            const user = await Users.findOne({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess()
            apiResponse.data.user = user
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //POST /api/users
    async addUser(req, res, next){
        try{
            const errorRequired = InputValidator.invalidAuth(req.body)
            if (errorRequired) throw errorRequired
            const errorInput = InputValidator.invalidUser(req.body)
            if (errorInput) throw errorInput
    
            const {email} = req.body
            const existUser = await Users.findOne({email})
            if (existUser) throw ErrorCodeManager.EMAIL_ALREADY_EXISTS
            
            const user = new Users(req.body)
            await user.save()
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User added')
            res.json(apiResponse)
        } catch(error){
            next(error)
        }
        
    }

    //PATCH /api/users/:userId
    async updateUser(req, res, next){
        try{
            const _id = req.params.userId
            if (!_id) throw ErrorCodeManager.MISSING_ID, 'User Id is required'
            const errorInput = InputValidator.invalidUser(req.body)
            if (errorInput) throw errorInput
    
            const user = await Users.findByIdAndUpdate(_id, req.body, {new: true})
            if (!user) throw next(ErrorCodeManager.USER_NOT_FOUND)

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User updated')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
        
    }

    //DELETE /api/users/:userId
    async deleteUser(req, res, next){
        try{
            const _id = req.params.userId
            if (!_id) throw ErrorCodeManager.MISSING_ID
            
            const user = await Users.deleteUsersById(_id, {new: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User deleted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
        
    }

    //PATCH /api/users/:userId/restore
    async restoreUser(req, res, next){
        try{
            const _id = req.params.userId
            const user = await Users.findOneAndRestoreUsers({_id}, {deleted: true, new: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            
            const apiResponse = new ApiResponse();
            apiResponse.setSuccess('User restored')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
        
    }

    //DELETE /api/users/:userId/force
    async forceDeleteUser(req, res, next){
        try{
            const _id = req.params.userId
            const user = await Users.findByIdAndDelete(_id)
            if(!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('User force deleted') 
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }
}

module.exports = new UserController()