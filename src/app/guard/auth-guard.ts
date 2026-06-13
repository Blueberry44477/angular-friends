import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    const signInPath = router.parseUrl('/sign-in');
    return new RedirectCommand(signInPath, { skipLocationChange: true });
  }
  
  return true;
};
