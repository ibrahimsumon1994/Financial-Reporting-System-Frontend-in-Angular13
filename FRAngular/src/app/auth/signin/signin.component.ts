import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { AsyncService } from '../../shared/services/async.service';
import { CommonService } from '../../shared/services/common.service';
import { Login } from '../actions/auth.actions';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './user.model';

@Component({
  selector: 'signin-component',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  formId = 'loginForm';
  form!: FormGroup;
  loginedsub!: Subscription;
  ipAddress: any;
  navigationList: any[] = [];
  //array: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', [Validators.required]],
      passWord: ['', [Validators.required]],
    });
    this.getIP();
  }

  getIP() {
    this.authService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  get userId() {
    return this.form.get('userId');
  }
  get password() {
    return this.form.get('password');
  }

  onLogin() {
    if (this.form.valid) {
      this.spinnerService.show();
      this.asyncService.start();
      const user: User = {
        userId: this.form.value.userId,
        password: this.form.value.passWord,
        ipAddress: this.ipAddress,
      };
      this.loginedsub = this.authService.authenticate(user).subscribe(
        (auth) => {
          if (auth) {
            if (auth.isAuthenticated && auth.userInformation) {
              if (auth.userInformation.navigationList) {
                // await this.menuLogic(auth.userInformation.navigationList);
                // if (this.array.length) {
                //   await this.menuLogic(this.array);
                // }
                this.navigationList = auth.userInformation.navigationList;
              }
              auth.userInformation.navigationList = this.navigationList;
              this.store.dispatch(new Login(auth));
              localStorage.setItem('token', auth.userInformation.token);
              localStorage.setItem('refreshToken', auth.userInformation.refreshToken);
              localStorage.setItem('userId', auth.userInformation.id);
              localStorage.setItem('menuList', JSON.stringify(auth.userInformation.menuList));
              this.router.navigate(['dashboard']);
              this.spinnerService.hide();
              this.commonService.showSuccessMsgForAdd(auth.message);
              this.asyncService.finish();
            } else {
              this.spinnerService.hide();
              this.commonService.showSuccessMsgForDelete(auth.message);
              this.asyncService.finish();
              return;
            }
          } else {
            this.spinnerService.hide();
            this.commonService.showSuccessMsgForDelete(
              'Server down. Please try again later!'
            );
            this.asyncService.finish();
            return;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.asyncService.finish();
          this.commonService.showErrorMsg(JSON.stringify(error));
        }
      );
    }
  }

  // async menuLogic(data: any) {
  //   data = data.sort((a: any, b: any) => a.parentId - b.parentId);
  //   if (data.length) {
  //     for (let i = 0; i < data.length; i++) {
  //       const bot = data[i];
  //       if (bot.parentId === 0) {
  //         this.navigationList.push({
  //           parentId: bot.parentId,
  //           menuId: bot.menuId,
  //           menuName: bot.menuName,
  //           menuLocation: bot.menuLocation,
  //           menuIcon: bot.menuIcon != null ? bot.menuIcon : 'build',
  //           children: [],
  //           type: 'link',
  //         });
  //       } else {
  //         let checkFirstLayer = this.navigationList.filter(
  //           (cs) => cs.menuId === bot.parentId
  //         );
  //         let flag = false;
  //         if (checkFirstLayer.length) {
  //           let index = this.navigationList.findIndex(
  //             (cs) => cs.menuId === bot.parentId
  //           );
  //           this.navigationList[index].type = 'sub';
  //           this.navigationList[index].children.push({
  //             parentId: bot.parentId,
  //             menuId: bot.menuId,
  //             menuName: bot.menuName,
  //             menuLocation: bot.menuLocation,
  //             menuIcon: bot.menuIcon != null ? bot.menuIcon : 'build',
  //             children: [],
  //             type: 'link',
  //           });
  //           flag = true;
  //         } else {
  //           // let firstLayerIndex;
  //           // let secondLayerIndex;
  //           for (let i = 0; i < this.navigationList.length; i++) {
  //             for (let j = 0; j < this.navigationList[i].children.length; j++) {
  //               const btt = this.navigationList[i].children[j];
  //               if (btt.menuId === bot.parentId) {
  //                 this.navigationList[i].children[j].type = 'sub';
  //                 this.navigationList[i].children[j].children.push({
  //                   parentId: bot.parentId,
  //                   menuId: bot.menuId,
  //                   menuName: bot.menuName,
  //                   menuLocation: bot.menuLocation,
  //                   menuIcon: bot.menuIcon != null ? bot.menuIcon : 'build',
  //                   children: [],
  //                   type: 'link',
  //                 });
  //                 flag = true;
  //               }
  //             }
  //           }
  //         }
  //         if (!flag) {
  //           this.array.push(bot);
  //         }
  //       }
  //     }
  //   }
  // }

  ngOnDestroy(): void {
    if (this.loginedsub) {
      this.loginedsub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
