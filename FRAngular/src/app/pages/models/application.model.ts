export interface Application {

    appId?: string ;
    fullName: string;
    purpose: string;
    appType: string;
    platform:string;
    framework: string;
    recStatus?: string,
    pageIndex?:number,
    pageSize?:number,
    searchString?: string,
    skip?:number,
    sl?:number,
    selectItemsPerPage?:number,
    // UmsModuleConfig: [],
    // UmsRole: []
  }
  export interface ServiceSetup {
    moduleCode:string
    fullName:string
    purpose:string
    appId:string
    recStatus:string
    imagePath:null
    app:null,
    umsFeatureConfigs:[]
  }

  export interface RoleWiseMenuAssign {
    serial?: number,
    roleDtlId?: number,
    roleId?: number,
    roleName?: string,
    menuId?: number,
    menuName?: string,
    createYn?: string,
    editYn?: string,
    deleteYn?: string,
    viewDetailYn?: string,
    authYn?: string
  }
  export interface Appid {
    view:string
    value:string
  }
  export interface CommonCode {
    commonCodeId:string
    code:string
    type:string
    nameEnglish:string
    nameBangla:string
    office: string
    recStatus:string,
    umsFeatureConfigs:[]
  }


  export interface Role {
    roleId:number
    roleName:string
    purpose:string
    appCode:string
    recStatus:string
  }
