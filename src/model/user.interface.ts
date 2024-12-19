export interface User {
    userId : string;
    userName: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    telephone: string;
    Tier: string;
    notification: boolean;
    notiNews: boolean;
    addrID: string;
    role: string;
    infoId?: number;
}

export interface Useraddress {
    addrID: string;
    Province: string;
    District: string;
    subDistrict: string;
    postCode: string;
    homeNubmer: string;
    alley?: string;
}

export interface AboutLandInterests {
    infoID: number;
    landTypeFV: string;
    landSizeFV: string;
    areaInterest?: string;
    budget: string;
    landUse: string;
    moreDetail: string;

}