export interface Authorization {
  featureCode?: string;
  appCode?: string;
  moduleCode?: string;
  tableName?: string;
  pkValue?: string;
  maxAuthLevel?: number;
  appAuthLevel?: number;
  userId?: string;
  action?: string;
  remark?: string;
  newRecord?: string;
  oldRecord?: string;
  recStatus?: string;
  url?: string;
  isAuthCancel?: string;
  createdByUserId?: string;
}