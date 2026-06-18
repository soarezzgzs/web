type RefundAPIResponse = {
    id: string
    userId: string
    name: string
    category: CategoriesAPIEnum
    amount: number
    filename: string
    user: {
        name: string
    }
}

type RefundsPaginationAPIResponse = {
    refund: RefundAPIResponse[],
    pagination: {
        page: number
        perPage: number
        totalRecords: number
        totalPages: number
    }

}