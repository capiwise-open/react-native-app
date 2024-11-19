import { AudiobookCategoryItem, AudiobookItem, BookCategoryItem, BookItem, CourseCategoryItem, CourseItem, InvestorItem, PodcastCategoryItem, PodcastItem } from "../api/strapi/types"
import { AlertData } from "../api/types"

export type RootStackParams = {
    Splash: undefined,
    CreateAlert: {
        update?: boolean,
        etf?: boolean,
        symbol: string
    },
    OverviewAlert: {
        alert: AlertData,
    },
    CloseAlert: {
        update?: boolean,
        etf?: boolean,
        symbol: string
    },
    DeleteAlert: {
        update?: boolean,
        symbol: string,
        etf?: boolean,
    },
    SummaryTab: {
        data: {
            key: string,
            activeTab?: number
        }
    },
    Login: undefined,
    Name?: {
        update?: boolean
    },
    NameEmail?: {
        fullName: string
    },
    NameEmailPhone: undefined,
    NEPPassword: {
        fullName: string,
        email: string,
        country: string,
        phoneNumber: string
    },
    VerifyUserScreen: undefined,
    Forgot: undefined,
    ResetPassword: undefined,
    Confirmation: undefined,
    PrivacyConditions: undefined,
    PrivacyPolicy: undefined,
    TermsAndConditions: undefined,
    First: {
        email?: string
    } | undefined,
    Second: {
        email?: string,
        myself: "Investor" | "Trader" | "Both" | null | undefined,
        trader: "EU" | "AS" | "US" | "CA" | null | undefined
    },
    Third: {
        email?: string,
        myself: "Investor" | "Trader" | "Both" | null | undefined,
        trader: "EU" | "AS" | "US" | "CA" | null | undefined,
        interest: string[],
    },
    ChangePasswordByCode: undefined,
    CloseAccStep2: undefined,
    ContactUs: undefined,
    CloseAccStep3: undefined,
    ClosureAcc: undefined,
    Profile: undefined,
    CloseAccStep4: undefined,
    CloseAccount: undefined,
    MessegeSent: undefined,
    SettingMain: undefined,
    SettingNotifications: undefined,
    EditPhoto: undefined,
    AccountMain: undefined,
    LannguageRegion: undefined,
    AddLocation: undefined,
    SetNewPassword: undefined,
    ExploreSearch: undefined,
    EtfTab: {
        symbol: string,
    },
    ManageAlerts: undefined,
    InboxScreen: undefined,
    NewsArticle: {
        data?: {
            key: any
        }
    },
    WatchListEdit: {
        data?: {
            watchList?: any[]
        }
    },
    MainApp: undefined,
    PushNotification: undefined,
    SystemNotification: undefined
}

export type DrawStackParams = {
    CryptoCurrencies: undefined,
    Currencies: undefined,
    Commodities: undefined,
    ExpertInvestors: undefined,
    RootStack: undefined,
    BookStack: undefined,
    AudiobookStack: undefined,
    CourseStack: undefined,
    PodcastStack: undefined,
    InvestorStack: undefined,
}

export type BookStackParams = {
    Books: undefined,
    BookInfo: {
        data: BookItem
    },
    BookList: {
        type: "TopRated" | "Latest" | "Category",
        category?: BookCategoryItem
    },
}

export type PodcastStackParams = {
    Podcasts: undefined,
    PodcastInfo: {
        data: PodcastItem
    },
    PodcastList: {
        type: "TopRated" | "Latest" | "Category",
        category?: PodcastCategoryItem
    }
}

export type AudioBookStackParams = {
    AudioBooks: undefined,
    AudiobookInfo: {
        data: AudiobookItem
    },
    AudiobookList: {
        type: "TopRated" | "Latest" | "Category",
        category?: AudiobookCategoryItem
    },
}

export type InvestorStackParams = {
    Investors: undefined,
    InvestorInfo: {
        data: InvestorItem
    },
    BookInfo: {
        data: BookItem
    }
}

export type CourseStackParams = {
    Courses: undefined,
    CourseInfo: {
        data: CourseItem
    },
    CourseList: {
        type: "TopRated" | "Latest" | "Category",
        category?: CourseCategoryItem
    }
}