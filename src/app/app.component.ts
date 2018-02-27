import { UsersService } from "./services/users.service";
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ProfileLstComponent } from "./profile-lst/profile-lst.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// Main kod
export class AppComponent implements OnInit {
   title = 'Aplikacija - osobe ljudi';
   selectedTab = 0;

   rForm1 : FormGroup;
   glavniSaved = false;
   glavniSavedTxt;
   ulogiran = false;
   ulogiranJe = {};

   constructor(
    private userService: UsersService,
    private fb: FormBuilder     
   ) 
   {

   }


  // Za provjeru logina

  checkLogin() {
     this.ulogiran = !this.ulogiran;
     this.ulogiranJe['ime'] = 'Hrvoje';
  }

   // Zapamti na kojem si indexu, da se moze koristiti programsko prebacivanje
   
   tabChanged (e: MatTabChangeEvent) {
     this.selectedTab = e.index;
   }

   createForm() {
     this.rForm1 = this.fb.group({
       'ime': ["", Validators.required],
       'prezime': ["", Validators.required],
       'email': ["", Validators.required],
       'username': ["", Validators.required],
       'password': ["", Validators.required],
     })
   }


   ngOnInit() {
     // Stvori formu za edit osnovnih podataka
     // Validators.compose([]) - za vise validacija

     this.createForm();
   }

   registracija(data) {

    // Ako forma nije ispravna - ne spremaj
    // - validacija se obavlja automatski
    if (!this.rForm1.valid) return;

    data["role"] = 3;
    console.log(data);
   
    
    // Spremi podatke u bazu
    this.userService.newUser(data)
       .then(x => { this.glavniSavedTxt = "Hvala na registraciji..." 
                    this.glavniSaved = true;

                    // Ponovno učitaj podatke za liste
                    ProfileLstComponent.Refresh = true;
                    DashboardComponent.Refresh = true;
                    this.rForm1.reset();
                    this.rForm1.markAsUntouched();
                    this.rForm1.markAsPristine();
                    this.selectedTab = 0;
             })
       .catch(x => {this.glavniSavedTxt = 'Greška u spremanju podataka.'; this.glavniSaved = true; });
    
 }
}

