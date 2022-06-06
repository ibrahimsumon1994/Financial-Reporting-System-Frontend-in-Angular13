import { AuthService } from './../../../auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, Subscription, of, Subscriber } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Auth } from '../../../auth/models/auth.model';
import { UIInfo } from '../../models/ui-info.model';
import { CommonService } from '../../services/common.service';
import { AsyncService } from '../../services/async.service';
import { NavService } from '../../services/nav.service';
import { NavItem, NavItemData } from '../../models/nav-item.model';
import { ChangePasswordComponent } from 'src/app/pages/user/change-password/change-password.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
//import { ServiceSetupService } from 'src/app/pages/services/service-setup.service';
//import { ApplicationService } from 'src/app/pages/services/application.service';
//import { CategoryService } from 'src/app/pages/services/category.service';
import { HttpHeaders } from '@angular/common/http';
import { Store } from "@ngxs/store";
import { Logout } from "../../../auth/actions/auth.actions";
import {
  StartAsyncLoad,
  FinishAsyncLoad,
} from "../../actions/async.actions";

@Component({
  selector: 'nav-menu',
  templateUrl: 'nav-menu.component.html',
  styleUrls: ['nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() ripple = true;
  @Output() toggleSidenavAfterClick = new EventEmitter<void>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  @ViewChild('appDrawer') appDrawer!: MatSidenav;
  mobileQuery: MediaQueryList;
  isLoggedIn$: Observable<boolean> = of(false);
  isLoading!: boolean;
  isFullScreen = false;
  authInfo!: Auth;
  uiInfo!: UIInfo;
  userId: any;
  fullName: any;
  //navItems: any[] = [];
  parentNavItems: any[] = [];
  subNavItems: any[] = [];
  subSubNavItems: any[] = [];
  returnedMenuList: any;
  allMenu: NavItemData[] = [];
  parentMenu: any[] = [];
  pushParentMenu: any[] = [];
  pushSubMenu: any[] = [];
  pushSubSubMenu: any[] = [];
  allSubMenu: any[] = [];
  subMenu: any[] = [];
  allSubSubMenu: any[] = [];
  subSubMenu: any[] = [] = [];
  newsub: any;
  //navItems: any[] = NavigationList.items;
  Data: NavItemData[] = [];
  MainMenu: NavItemData[] = [];
  SubMenu: NavItemData[] = [];
  match: any[] = [];
  subPushed: any[] = [];
  // @Input() navItems: NavItem;
  private authSub!: Subscription;
  private uiInfoSub!: Subscription;
  private asyncSub!: Subscription;
  navigationList: any[] = [];
  loginSub!:Subscription
  navItem!: NavItem;
  defaultsrc = '/assets/images/avatar_square_blue.png';

  private _mobileQueryListener: () => void;
  routerOutletActive: boolean = false;

  constructor(
    private authService: AuthService,
    //private setupService: ServiceSetupService,
    //private applicationService: ApplicationService,
    //private categoryService: CategoryService,
    private commonService: CommonService,
    private asyncService: AsyncService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public navService: NavService,
    public dialog: MatDialog,
    private store: Store,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(event => {
      // close sidenav on routing
      this.toggleSidenavAfterClick.emit();
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.uiInfoSub = this.commonService.uiInfo.subscribe((uiInfo) => {
      this.uiInfo = uiInfo;
      this.changeDetectorRef.detectChanges();
    });
    this.authSub = this.authService.authInfo.subscribe((authInfo) => {
      this.authInfo = authInfo;
      this.routerOutletActive = true;
      this.changeDetectorRef.detectChanges();
    });
    this.asyncSub = this.asyncService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
      this.changeDetectorRef.detectChanges();
    });
    this.loginSub = this.authService.menuList.subscribe(
      data => {
        if (data) {
          this.navigationList = data;
        }
      },
      error => {
        // this.asyncService.finish();
      }
    );
    this.asyncService.finish(); // close aborted loading
  }
  get navItems$() {
    return this.authService.menuList;
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
  }
  onLogOut(): void {
    let userId = localStorage.getItem("userId");
    this.authService.logout(userId).subscribe(data => {
      if(data)
      {
        if(data.isExecute)
        {
          this.appDrawer.close(); // closing sidenav
          localStorage.clear();
          this.store.dispatch(new StartAsyncLoad());
          this.store.dispatch(new Logout());
          this.store.dispatch(new FinishAsyncLoad());
          this.router.navigate(["auth"]);
        }
        else
        {
          this.commonService.showErrorMsg(data.message);
        }
      }
      else
      {
        this.commonService.showErrorMsg("Server error!");
      }
    });
  }
  async passFeatureCode(code: any) {
    return new Promise(function (resolve, reject) {
      // Only `delay` is able to resolve or reject the promise
      setTimeout(function () {
        resolve(42); // After 3 seconds, resolve the promise with value 42
      }, 3000);
    });
  }
  onPasswordChange() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "30%"
    dialogConfig.data = localStorage.getItem("userId");
    this.dialog.open(ChangePasswordComponent, dialogConfig)
  }
  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      this.goFullScreen();
    } else {
      this.exitFullScreen();
    }
  }

  private goFullScreen(): void {
    const docElm = document.documentElement as any;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
  }

  private exitFullScreen(): void {
    const doc = document as any;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitCancelFullScreen) {
      doc.webkitCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
  generateOutputEvent() {
    this.toggleSidenavAfterClick.emit();
  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.uiInfoSub.unsubscribe();
    this.authSub.unsubscribe();
    this.asyncSub.unsubscribe();
    this.asyncService.finish();
  }
}
