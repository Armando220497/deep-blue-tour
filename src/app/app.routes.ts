import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { GuestGuard } from './auth/guest.guard'; // Impedisce la registrazione a utenti autenticati
import { AuthGuard } from './auth/auth.guard';
import { ExtraOptions } from '@angular/router';
import { AlbumComponent } from './components/album/album.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'album', component: AlbumComponent },
    ],
  },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] }, // Impedisce login se già autenticato
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] }, // Impedisce registrazione se già autenticato
];
