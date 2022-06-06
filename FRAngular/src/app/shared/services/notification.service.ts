import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TruncatePipe } from "../pipes/truncate.pipe";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone,
    private pipe: TruncatePipe
  ) {}

  showSuccessMsg(message: string, duration = 2000): void {
    this.zone.run(() => {
      this.snackBar.open(message, "", {
        duration: duration,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: ["snackbar-container", "success"]
      });
    });
  }

  showErrorMsg(message: string, duration = 5000): void {
    this.zone.run(() => {
      message = this.pipe.transform(message, 100);
      this.snackBar.open(message, "", {
        duration: duration,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: ["snackbar-container", "danger"]
      });
    });
  }
}
