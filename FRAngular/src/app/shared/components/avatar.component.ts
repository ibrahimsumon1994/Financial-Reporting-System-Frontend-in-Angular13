import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'avatar',
  template: `
    <img
      class="avatar"
      matRipple
      [width]="size || 40"
      [height]="size || 40"
      [src]="imageSrc || defaultSrc"
      (click)="onClick()"
    />
  `,
  styles: [
    `
      .avatar {
        object-fit: cover;
        border-radius: 50%;
        display: flex;
        cursor: pointer;
        border: 2px solid #f5f0f0;
      }
    `
  ]
})
export class AvatarComponent {
  @Input() data: any;
  @Input() imageSrc!: string;
  @Input() size!: number;
  defaultSrc = '/assets/images/avatar_square_blue.png';

  constructor(private element: ElementRef) {}

  onClick(): void {
    this.element.nativeElement.dispatchEvent(
      new CustomEvent('avatar-click', {
        bubbles: true,
        detail: this.data
      })
    );
  }
}
