import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service/Auth/auth.service'; // Assuming you have an AuthService
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles: string[] = route.data['roles'] || []; // Default to an empty array if `roles` is undefined

    return this.authService.checkRole().pipe(
      map((userRole) => {
        userRole = userRole['role'];
        
        if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
          // Grant access if no roles are defined or the user's role matches
          return true;
        } else {
          this.router.navigate(['/Unauthorized']); // Redirect to unauthorized page
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/Signin']); // Redirect to sign-in on error
        return [false];
      })
    );
  }
}
