export type BookItem = {
    id: number,
    attributes: {
        title: string,
        thumb?: any,
        summary: string,
        author: string,
        rating: number,
        rating_count: number,
        category?: string,
        price: number,
        url?: string,
        asin: string,
        publish_at: string,
        related_books: {
            data: BookItem[]
        }
    }
}

export type CarouselItem = {
    id: number,
    attributes: {
        title: string,
        banner: any,
        url?: string,
    }
}

export type DashboardCarouselItem = {
    id: number,
    attributes: {
        title: string,
        banner: any,
        url?: string,
        sub_title: string,
        category: "currencies" | "goods" | "books" | "commodities" | "courses"
    }
}

export type BookCategoryItem = {
    id: number,
    attributes: {
        title: string,
        thumb: any,
        related_books: {
            data: { attributes: BookItem, id: number }[]
        }
    }
}

export type AudiobookItem = {
    id: number,
    attributes: {
        title: string,
        thumb?: any,
        summary: string,
        author: string,
        rating: number,
        rating_count: number,
        category?: string,
        price: number,
        url?: string,
        asin: string,
        publish_at: string,
        related_books: {
            data: AudiobookItem[]
        }
    }
}

export type AudiobookCategoryItem = {
    id: number,
    attributes: {
        title: string,
        thumb: any,
        related_books: {
            data: { attributes: AudiobookItem, id: number }[]
        }
    }
}


export type PodcastItem = {
    id: number,
    attributes: {
        title: string,
        thumb?: any,
        summary: string,
        author: string,
        rating: number,
        rating_count: number,
        category?: string,
        price: number,
        url?: string,
        asin: string,
        publish_at: string,
        related_podcasts: {
            data: PodcastItem[]
        }
    }
}

export type PodcastCategoryItem = {
    id: number,
    attributes: {
        title: string,
        thumb: any,
        related_books: {
            data: { attributes: PodcastItem, id: number }[]
        }
    }
}

export type InvestorItem = {
    id: number,
    attributes: {
        name: string,
        title: string,
        about: string,
        picture: any,
        net_worth: number,
        books: {
            data: BookItem[]
        }
    }
}

export type CourseItem = {
    id: number,
    attributes: {
        title: string,
        thumb?: any,
        summary: string,
        author: string,
        rating: number,
        rating_count: number,
        category?: string,
        price: number,
        url?: string,
        asin: string,
        publish_at: string,
        related_courses: {
            data: CourseItem[]
        }
    }
}

export type CourseCategoryItem = {
    id: number,
    attributes: {
        title: string,
        thumb: any,
        related_courses: {
            data: { attributes: CourseItem, id: number }[]
        }
    }
}