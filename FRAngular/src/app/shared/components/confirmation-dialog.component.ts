import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { ConfirmationDialog } from "../models/confirmation-dialog.model";
import { AsyncService } from "../services/async.service";

@Component({
  selector: "confirmation-dialog",
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div *ngIf="isTemplateRef(data?.content); else stringContent">
      <!-- <mat-dialog-content *ngTemplateOutlet="data.content"></mat-dialog-content> -->
    </div>
    <ng-template #stringContent>
      <mat-dialog-content [innerHTML]="data.content"></mat-dialog-content>
    </ng-template>
    <mat-dialog-actions *ngIf="!data?.disableActionButtons" fxLayoutAlign="end">
      <button
        mat-raised-button
        [mat-dialog-close]="true"
        style="background-color:green; color: white"
        [disabled]="asyncService.isLoading | async"
      >
        {{ data.confirmButtonText || "YES" }}
      </button>
      <button
        mat-raised-button
        [mat-dialog-close]="false"
        style="background-color:red; color: white"
      >
        {{ data.cancelButtonText || "NO" }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public asyncService: AsyncService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog
  ) {}

  isTemplateRef(content: any): boolean {
    if (typeof content !== "string") {
      return true;
    }
    return false;
  }
}
