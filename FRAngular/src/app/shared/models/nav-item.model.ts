export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}


export interface NavItemData {
  menuLocation?:string
  menuId: number
  menuSequence?: number
  menuName?: string
  parentId: number
  roleId?:number
  userId?: string
  menuIcon?: string
  createYn?:string
  editYn?:string
  deleteYn?:string
  viewDetailYn?:string
  authYn?:string
}
