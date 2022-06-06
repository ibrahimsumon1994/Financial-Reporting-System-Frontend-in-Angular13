export interface ActiveSession {
     sessionId:number,
     userId:string,
     ipAddress: string,
     recStatus: string,
     loginDatetime: Date,
     logoutDatetime: Date
}