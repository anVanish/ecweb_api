function parseNumber(number){
    const parsedValue = parseInt(number)
    return parsedValue > 0 ? parsedValue : undefined
}

//product
function sortProduct(query){
    const validSortFields = ['pops', 'time', 'sales', 'price']
    const sortBy = validSortFields.includes(query.sortBy) ? query.sortBy : 'pops'
    const order = (['asc', 'desc'].includes(query.order) && query.order === 'asc') ? 1 : -1
    const sort = {}
    if (sortBy === 'price')
        sort.minPrice = order
    else if (sortBy === 'time')
        sort.createdAt = order

    return sort
}

function parseFilterProduct(query, filter={}){
    const filters = []
    filters.push(filter)

    if (query.search)
        filters.push({'name': { $regex: `.*${query.search}.*`, $options: 'i' }})
    if (query.category) 
        filters.push({'category.categorySlug': query.category})
    if (query.subCategories){
        const subCategories = query.subCategories.split(',')
        const orFilters = subCategories.map((item) => ({ 
            'category.subCategorySlug': item 
        }))
        filters.push({$or: orFilters})
    }

    return {$and: filters}
}

function filterProducts(query, filter = {}){
    //default 
    //deleted = false, all = false
    //page = 1, limit = 10
    //sortBy = 'pops', order = 'desc'
    
    //options
    const deleted = (query.deleted === 'true')
    const all = (query.all === 'true')
    const options = {deleted, all}
    //pagination
    const page = parseNumber(query.page) || 1
    const limit = parseNumber(query.limit) || 10
    const pagination = {page, limit}
    //sort
    const sort = sortProduct(query)
    //filters
    const filters = parseFilterProduct(query, filter)
    
    return {filters, pagination, sort, options}
}

//orders
function sortOrders(query){
    const validSortFields = ['date', 'price']
    const sortBy = validSortFields.includes(query.sortBy) ? query.sortBy : 'date'
    const order = (['asc', 'desc'].includes(query.order) && query.order === 'asc') ? 1 : -1
    const sort = {}
    if (sortBy === 'date')
        sort.updatedAt = order
    else if (sortBy === 'price')
        sort.totalPrice = order

    return sort
}

function parseFilterOrders(query, filter){
    const availableStatuses = ['to-pay', 'to-confirm', 'to-ship', 'to-receive', 'completed', 'canceled']
    const filters = []
    filters.push(filter)
    if (query.search)
    {
        const regexSearch = new RegExp(`.*${query.search}.*`, 'i');
        filters.push({$or: [
            {'shop.name': regexSearch},
            {'products': { 
                $elemMatch: {
                    'name': regexSearch
                }}
            },
            {'orderNumber': regexSearch},
        ]})
    }
    if (query.shopId) 
        filters.push({'shop._id': query.shopId})
    if (query.userId)
        filters.push({'userId': query.userId})

    if (query.status && availableStatuses.includes(query.status))
        filters.push({status: query.status})

    return {$and: filters}
}

function filterOrders(query, filter = {}){
    //default
    //page = 1, limit = 5
    //order = desc, sortBy = date
    //status = all
    //userId = undefined, shopId = undefined, search = ''

    //pagination
    const page = parseNumber(query.page) || 1
    const limit = parseNumber(query.limit) || 5
    const pagination = {page, limit}

    //sort
    const sort = sortOrders(query)
    
    //filters
    const filters = parseFilterOrders(query, filter)
    console.log(filters['$and'][1])
    return {filters, sort, pagination}
}

module.exports = {filterProducts, filterOrders}