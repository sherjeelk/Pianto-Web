import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageConstants} from '../MessageConstants';
import {ActivatedRoute, Router} from '@angular/router';


/** This class automatically catches all errors and any action can be taken
 * based on these error for ex : Redirect to login if status is 401 or display data related
 * error message if status code is : 400
 */

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar, private router: Router) {
  }


  static getErrorMessage(error: number, url): string {
    return  MessageConstants.getMessage(error, url);
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('this is client side error', this.router.url);
            errorMsg = `Error: ${error.error.message}`;
            this.openSnackBarError(errorMsg, '');

          } else {
            console.log('this is server side error');
            errorMsg = HttpErrorInterceptor.getErrorMessage(error.status, this.router.url);
            // we can also show the error message from here
            this.openSnackBarError(errorMsg, '');
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      );

  }

  openSnackBarError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }
}
