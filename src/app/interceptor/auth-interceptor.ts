import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../service/auth-service";
import { inject } from "@angular/core";
import { AccessTokenDTO } from "../dto/access-token-dto";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const accessTokenData: AccessTokenDTO | null = authService.getAccessTokenData();

    let modifiedReq = req;
    if (accessTokenData) {
        modifiedReq = req.clone({
            setHeaders: {
                Authorization: `${accessTokenData.tokenType} ${accessTokenData.accessToken}`
            }
        });
    } else {
        modifiedReq = req.clone({
            withCredentials: true
        });
    }

    return next(modifiedReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                return authService.refreshTokens().pipe(
                    switchMap((accessTokenDto: AccessTokenDTO) => {
                        authService.setAccessTokenData(accessTokenDto);

                        const clonedWithNewToken = req.clone({
                            setHeaders: {
                                Authorization: `${accessTokenDto.tokenType} ${accessTokenDto.accessToken}`
                            }
                        });

                        return next(clonedWithNewToken);
                    }),
                    catchError((refreshError) => {
                        authService.signOut();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};