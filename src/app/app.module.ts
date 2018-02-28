import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// H.
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";

import { MatTableModule } from "@angular/material/table";
import { UsersService } from "./services/users.service";
import { MatDialogModule } from "@angular/material";

import { EditProfileDialogClass } from "./dashboard/dashboard.component";
import { ProfileLstComponent, ShowProfileDialogClass } from './profile-lst/profile-lst.component';
import { LoginDialogClass } from './app.component';

import { Component } from '@angular/core';


const appRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent }
  // { path: 'profil',      component: HeroDetailComponent },
];

@NgModule({
  declarations: [
     AppComponent, 
     DashboardComponent, 
     ProfileComponent, 
     EditProfileDialogClass, 
     LoginDialogClass, 
     ProfileLstComponent,
     ShowProfileDialogClass],
  imports: [
    BrowserModule,
    // H.
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatRadioModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    

    // b
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  entryComponents: [
    EditProfileDialogClass,
    ShowProfileDialogClass,
    LoginDialogClass
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
