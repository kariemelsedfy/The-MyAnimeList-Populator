import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OauthCallbackComponent } from './oauth-callback/oauth-callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'oauth-callback', component: OauthCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }