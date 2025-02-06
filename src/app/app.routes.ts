import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { GuestGuard } from './auth/guest.guard'; // Guard to prevent access to login if already authenticated

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent, // Navbar as parent component for child routes
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route redirection
      { path: 'home', component: HomeComponent }, // Home page
      { path: 'about', component: AboutComponent }, // About page
      { path: 'contact', component: ContactComponent }, // Contact page
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard], // Prevent access to login if already authenticated
  },
  { path: 'register', component: RegisterComponent }, // Registration page
];
