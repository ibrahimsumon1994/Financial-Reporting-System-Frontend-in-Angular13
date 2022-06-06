import { TemplateRef } from '@angular/core';

export interface UIInfo {
  title: string;
  goBackPath?: string;
  refreshPath?: string;
  addNewPath?: string;
  formId?: string;
  editPath?: string;
  goFullScreen?: boolean;
  additionalComponent?: TemplateRef<any>;
  refresh?: () => void;
  qrcode?: () => void;
  goBack?: () => void;
  goNext?: () => void;
  submitAll?: () => void;
}
