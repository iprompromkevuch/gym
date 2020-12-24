const pagination = (item, limit, page) => {
    if (item.pages) {
        return {
            total    : item.pages ? +item.pages.total : 0,
            perPage  : +limit,
            page     : +page,
            lastPage : item.pages ? +item.pages.lastPage : 0
        }
    }

    return !item.total ? {
        total    : item[0] ? +item[0].count : 0,
        perPage  : +limit,
        page     : +page + 1,
        lastPage : item[0] ? (item[0].count ? Math.floor(+item[0].count / limit) : 1) + 1 : 1
    } : {
        total    : +item.total,
        perPage  : +item.perPage,
        page     : +item.page + 1,
        lastPage : +item.lastPage + 1
    }
}

module.exports = pagination;