export interface User {
    userId: string,
    userFullName: string,
    categoryId: number,
    cellNo: string,
    email: string,
    dob?: Date,
    mfa: string,
    macaddress: string,
    ipAddress: string,
    recStatus: string,
    picture: BinaryType,
    signature: BinaryType,
    thumb: BinaryType,
    category:{
        categoryId: number,
        categoryName: string,
        recStatus: string
    }
    // createdBy: string,
    // updatedBy: string
}