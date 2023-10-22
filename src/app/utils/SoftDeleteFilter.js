
class SoftDeleteFilter{
    //options all: all users, deleted: only deleted user
    //pending: only pending deleted user
    //addPending: not deleted user and pending deleted user
    //default: only not deleted user
    static userFilter = function(filters={}, options={}){
        const {all=false, deleted=false, pending=false, addPending=false} = options
        
        if (all) return filters

        const twentyFourHoursAgo = new Date()
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
        if (deleted) return { 
            $and: [
                filters, 
                { isDeleted: true }
            ]}

        if (pending) return {
            $and: [
                filters,
                {
                    isDeleted: true,
                    deletedAt: {$gte: twentyFourHoursAgo}
                }
            ]
        }

        if (addPending) return {
            $and: [
                filters,
                {$or: [
                    {isDeleted: false},
                    {isDeleted: {$exists: false}},
                    {deletedAt: {$gte: twentyFourHoursAgo}, isDeleted: true}
                ]},
            ]
        }

        return {
            $and: [
                filters,
                {$or: [
                    {isDeleted: false},
                    {isDeleted: {$exists: false}}
                ]}
            ]
        }
    }
}


module.exports = SoftDeleteFilter