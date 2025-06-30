// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent }          from './app.component';
import { OauthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AnimeProfileComponent } from './anime-profile-form-component/anime-profile-form-component.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppComponent,
    OauthCallbackComponent,
    HomeComponent, 
    AnimeProfileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
