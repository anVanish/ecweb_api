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
function parseNumber(number){
    const parsedValue = parseInt(number)
    return parsedValue > 0 ? parsedValue : undefined
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

module.exports = {filterProducts}