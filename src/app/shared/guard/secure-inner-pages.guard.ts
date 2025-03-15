/**
   @(C): Entire Software
   @Type: ts
   @Name: auth.service.ts
   @Who: Mukesh Kumar rai
   @When: 23-Sept-2020
   @Why: ROST-205
   @What: user authorization functions
  */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router, private snackBar: MatSnackBar) {

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userAccess = this.authService.getUserAccesConrtrol();
    const Component = next.data.component;
    if (userAccess.map(e => e.component).indexOf(Component) === -1) {
      this.openSnackBar('Access denied!', 'close', 'warn-snackbar');
      return false;
    }
    return true;
  }
  /**
   @(C): Entire Software
   @Type: Function
   @Who: Mukesh kumar rai
   @When: 15-Sept-2020
   @Why:  ROST-189
   @What: This function used for passing data to the toast component
   @Return: None
   @Params :
   1. message - Message which you want to show in toast
   2.action - action on button for close
  */
  openSnackBar(message: string, action: string, className: string) {
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: [className],
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data: {
        html: message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }
}
