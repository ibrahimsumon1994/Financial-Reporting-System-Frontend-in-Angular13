import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NavItem } from '../../models/nav-item.model';
import { NavService } from '../../services/nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-menu-item',
  templateUrl: './nav-menu-item.component.html',
  styleUrls: ['./nav-menu-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class NavMenuItemComponent implements OnInit {
  expanded: boolean = false;
  //secondExpanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  //@HostBinding("attr.aria-expanded") secondAriaExpanded = this.secondExpanded;
  @Input() item: any;
  @Input() depth?: number;
  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
    // this.secondNavService.currentUrl.subscribe((url) => {
    //   if (this.item.route && url) {
    //     this.secondExpanded = url.indexOf(`/${this.item.route}`) === 0;
    //     this.secondAriaExpanded = this.secondExpanded;
    //   }
    // });
  }

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.menuLocation]);
      this.navService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
  // onChildSelected(child: any) {
  //   if (!child.children || !child.children.length) {
  //     this.router.navigate([child.menuLocation]);
  //     this.secondNavService.closeNav();
  //   }
  //   if (child.children && child.children.length) {
  //     this.secondExpanded = !this.secondExpanded;
  //   }
  // }
}
