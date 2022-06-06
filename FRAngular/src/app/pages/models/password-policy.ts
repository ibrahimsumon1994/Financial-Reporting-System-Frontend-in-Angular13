export interface PasswordPolicy{
    passwordPolicyId:number
    appId: string
    minlength: number
    maxlength: number
    expireAfter: number
    reuse: number
    isUpperCase: string
    isLowerCase: string
    isSpecialChar: string
    recstatus: string
}