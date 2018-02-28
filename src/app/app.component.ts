import { UsersService } from "./services/users.service";
import { Component, OnInit, Inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ProfileLstComponent } from "./profile-lst/profile-lst.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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
   velikiEkran = true;

   constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    public dialog: MatDialog     
   ) 
   {
    
   }


  openLoginDialog(): void {
    let dialogRef = this.dialog.open(LoginDialogClass, {
      width: "320px",
      data: null
    });
  }

   
  // Ako nitko nije ulogiran - pitaj username i password

  checkLogin(init) {
     if (!localStorage.getItem("ulogiran")) this.openLoginDialog();
        else {
          // odlogiraj
          localStorage.setItem("ulogiran", "");
          localStorage.setItem("ulogiran-role", "");
          localStorage.setItem("ulogiran-ime", "");
          localStorage.setItem("ulogiran-id", "");
          localStorage.setItem("ulogiran-token", "");
        }
  }

  
  // Check za elemente na templateu, u headeru 

  jelUlogiran() {
    return localStorage.getItem("ulogiran");
  }

  dajLoginIme() {
    return localStorage.getItem("ulogiran-ime");
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

     // Refresh, ako se update-a
     setInterval(x => {
       if (window.innerWidth > 500) this.velikiEkran = true;
         else this.velikiEkran = false;
      }, 2000);

      // Auto logout
      // setInterval(x => {
      //  this.userService.getLoginUser(LOCALSTORAGE["access_token"]).catch(z => {
      //    console.log("Session expired.");
      //    localStorage.setItem("ulogiran", "");
      //    this.checkLogin(false);          
      //  })      
      // }, 20*1000);


     this.createForm();

   }

   registracija(data) {

    // Ako forma nije ispravna - ne spremaj
    // - validacija se obavlja automatski
    if (!this.rForm1.valid) return;

    data["role"] = 3;
    // console.log(data);
   
    
    // Spremi podatke u bazu
    this.userService.newUser(data)
       .then(x => { this.glavniSavedTxt = "Hvala na registraciji." 
                    this.glavniSaved = true;

                    // Ponovno učitaj podatke za liste
                    ProfileLstComponent.Refresh = true;
                    DashboardComponent.Refresh = true;
                    setTimeout( x => {
                       this.rForm1.reset();
                       this.rForm1.markAsUntouched();
                       this.rForm1.markAsPristine();   
                       this.glavniSaved = false;                    
                       this.selectedTab = 0;
                    }, 1000);
             })
       .catch(x => {this.glavniSavedTxt = 'Greška u spremanju podataka.'; this.glavniSaved = true; });
    
 }
}

// Za dialog komponentu - login
// -----------------------------

@Component({
  selector: 'login-dialog-class',
  templateUrl: 'login.html',
})

export class LoginDialogClass implements OnInit{

  id;
  details;
  loginForm;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogClass>,
    private fb: FormBuilder,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUsersDetails(id : number) {
    this.userService.getUsersDetails(id).then(x => {
       this.details = x; 
    });

    
  }

  loginErr = false;

  loginUserPass(data) {

    this.userService.login(data).then(x => {
       // console.log(x);

       // Nakon sto login na server uspije, postavi varijable
       localStorage.setItem("ulogiran-token", x["access_token"]);

       // Nakon toga, dohvati detalje (za dobiveni token)
       // TODO - hvatanje greske

       this.userService.getLoginUser(x["access_token"]).then(y => {
           // console.log(y);

           localStorage.setItem("ulogiran", "1");
           localStorage.setItem("ulogiran-role", y['role']);
           localStorage.setItem("ulogiran-ime", y['ime']);
           localStorage.setItem("ulogiran-id", y['id']);
           this.dialogRef.close();
       })
       .catch( x => {
            this.loginErr = true;          
         })

    })
    .catch( x => {
        this.loginErr = true;  
        setTimeout( x => {
           this.loginErr = false;
        }, 2000);
    }); 
    
   
 }


  // Podatke ucitavamo kod otvaranja dialoga
  // i ovdje definiramo getUserDetails. To se radi zato
  // sto podaci stizu asinkrono i da bi se prikazali asinkrono,
  // trebaju biti u nekoj varijabli unutar klase. Tj. promise
  // ili observable treba raditi unutar klase.

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'username': ["", Validators.nullValidator],
      'password': ["", Validators.nullValidator],
     });

  }

}


