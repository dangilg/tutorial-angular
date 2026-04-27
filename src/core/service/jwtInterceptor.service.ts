import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const jwtInterceptor: HttpInterceptorFn=(req,next)=>{

  const authService = inject(AuthService);
  const token = authService.getToken();

  if(token){
    const authReq = req.clone({
      setHeaders:{
        Authorization:`${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
}
