import { Routes } from '@angular/router';
import { SignInComponent } from './component/sign-in.component/sign-in.component';
import { SignUpComponent } from './component/sign-up.component/sign-up.component';

export const routes: Routes = [
    {
        path: 'sign-in',
        component: SignInComponent,
        title: 'Sign In'
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
        title: 'Sign Up'
    }
];
