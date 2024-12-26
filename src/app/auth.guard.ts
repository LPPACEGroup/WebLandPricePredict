import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service/Auth/auth.service';  // Assuming you have an AuthService
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          // this.router.navigate(['/Signin']);
          return false;
        }
      }),
      catchError(() => {
        // this.router.navigate(['/Signin']);
        return [false];
      })
    );
  }
}
