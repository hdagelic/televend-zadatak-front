import { Component, OnInit, Inject } from "@angular/core";
import { UsersService } from "../services/users.service";
import { ProfileLstComponent } from "../profile-lst/profile-lst.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  users;
  displayedColumns = [];
  
  // Stvari koje se trebaju mijenjati ovisno o rezoluciji
  
  setDisplay(width) {
     if (width > 600)  this.displayedColumns = ["id", "ime", "created_at", "updated_at", "edit", "delete"];
        else this.displayedColumns = ["id", "ime", "edit", "delete"];
  }

   
  // Da li refreshati podatke?
  public static Refresh = false;

  constructor(private userService: UsersService, public dialog: MatDialog) {}


  ngOnInit() {
    this.setDisplay(window.innerWidth);
    this.getAllUsers();

    // Refresh, ako se update-a
    setInterval(x => {
      if (DashboardComponent.Refresh) {
         this.getAllUsers(); 
         DashboardComponent.Refresh = false;
       }
       this.setDisplay(window.innerWidth);
      }, 2000);
  }

  getAllUsers() {
    this.userService.getAllUsers().then(x => {
      // console.log(x);
      this.users = x;
    });
  }


  jelAktivanEdit(uid) {
   // if (!this.ulogiran) return "gray";
    let ulogiranS = localStorage.getItem("ulogiran");
    if (!ulogiranS) return "gray";
      else {
         // ako je manager ili admin, vrati true
         // ako je user - vrati true samo za njega
         let ulogiran_roleS = localStorage.getItem("ulogiran-role");
         let ulogiran_idS = localStorage.getItem("ulogiran-id");
         
         if (ulogiran_roleS == "1" || ulogiran_roleS == "2") return "white";
         if (ulogiran_idS == uid) return "white";

         return "gray";
      }
  }
  

  deleteUser(id) {
    if (this.jelAktivanEdit(id) == "gray") {
       alert("Nemate prava za uređivanje. Provjerite login.");
       return;
    }

     console.log(id);
     this.userService.deleteUser(id).then(x => {
      // console.log(x);
      this.getAllUsers();
      ProfileLstComponent.Refresh = true;
    });
  }

  openDialog(user): void {
    if (this.jelAktivanEdit(user.id) == "gray") {
      alert("Nemate prava za uređivanje. Provjerite login.");
      return;
    }

    let dialogRef = this.dialog.open(EditProfileDialogClass, {
      width: "580px",
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllUsers();
      // console.log("The dialog was closed");
    });
  }
}

// Za dialog komponentu - edit
// ----------------------------

@Component({
  selector: 'edit-profile-dialog-class',
  templateUrl: 'edit-profile.html',
})

export class EditProfileDialogClass implements OnInit{

  // Podaci

  id;
  user;
  details;
  roleStr;

  // Za forme
  
  rForm1 : FormGroup;
  rForm2 : FormGroup;
  rForm3 : FormGroup;
  glavniSaved = false;
  detaljiSaved = false;
  slikaSaved = false;
  glavniSavedTxt;
  detaljiSavedTxt;
  slikaSavedTxt;
  detailsLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogClass>,
    private userService: UsersService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Stvori formu za edit osnovnih podataka
  // poziva se nakon dohvata podataka

  stvoriFormuDetalji() {
     
    this.rForm2 = this.fb.group({
      'id': [this.user.id, Validators.nullValidator],
      'adresa': [this.details.adresa, Validators.nullValidator],
      'postcode': [this.details.postcode, Validators.nullValidator],
      'telefon': [this.details.telefon, Validators.nullValidator],
      'datum_rodjenja': [this.details.datum_rodjenja, Validators.nullValidator],
      'spol': [this.details.spol, Validators.nullValidator],
      'slika': [this.details.slika, Validators.nullValidator],
    })

    this.rForm3 = this.fb.group({
      'id': [this.user.id, Validators.nullValidator],
      'slika' : null
    })

    this.detailsLoaded = true;
  }


  getUsersDetails(id : number) {
    this.userService.getUsersDetails(id).then(x => {
       this.details = x; 
       this.stvoriFormuDetalji();
    });
  }

  // Podatke ucitavamo kod otvaranja dialoga
  // i ovdje definiramo getUserDetails. To se radi zato
  // sto podaci stizu asinkrono i da bi se prikazali asinkrono,
  // trebaju biti u nekoj varijabli unutar klase. Tj. promise
  // ili observable treba raditi unutar klase.

  ngOnInit(): void {
    this.id = this.data.id;
    this.user = this.data;
 
    if (this.user.role == 1) this.roleStr = "Administrator";
    else if (this.user.role == 2) this.roleStr = "Manager";
    else if (this.user.role == 3) this.roleStr = "User";

    this.detailsLoaded = false;
    this.getUsersDetails(this.id);

   // Stvori formu za edit osnovnih podataka
   // Validators.compose([]) - za vise validacija

    this.rForm1 = this.fb.group({
       'id': [this.user.id, Validators.required],
       'ime': [this.user.ime, Validators.required],
       'prezime': [this.user.prezime, Validators.required],
       'email': [this.user.email, Validators.required],
       'username': [this.user.username, Validators.required],
       'password': ["", Validators.nullValidator],
       'role': [this.user.role, Validators.required],
    })


  }

  submitGlavni(data) {

     // Ako forma nije ispravna - ne spremaj
     // - validacija se obavlja automatski
     if (!this.rForm1.valid) return;

     let ulogiran_roleS = localStorage.getItem("ulogiran-role");
     
     if ((ulogiran_roleS == '3') && (data.role != '3')) {
         this.glavniSavedTxt = 'obični korisnik ne može mijenjati role.'; this.glavniSaved = true;
         return;
     } 

     // Spremi podatke u bazu
     // data['password'] = '';
     // console.log(data);
     this.userService.updateUser(data.id, data)
        .then(x => { this.glavniSavedTxt = new Date().toLocaleString(); 
                     this.glavniSaved = true;
                     ProfileLstComponent.Refresh = true;
              })
        .catch(x => {this.glavniSavedTxt = 'greška u spremanju.'; this.glavniSaved = true; });
  }

  submitDetails(data) {

    // Ako forma nije ispravna - ne spremaj
    // - validacija se obavlja automatski
    if (!this.rForm2.valid) return;

    // console.log(data);
    this.userService.updateUserDetails(data.id, data)
        .then(x => { this.detaljiSavedTxt = new Date().toLocaleString(); 
                     this.detaljiSaved = true;
              })
        .catch(x => {this.detaljiSavedTxt = 'greška u spremanju.'; this.detaljiSaved = true; });

  }

  // Upload slike

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.rForm3.get('slika').setValue(file);
    }
  }

  private prepareSave(): any {
    let input = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    input.append('slika', this.rForm3.get('slika').value);
    return input;
  }


  spremiSliku(data) {
     // console.log(data.slika);

     this.userService.uploadSlike(data.id, this.prepareSave())
        .then(x => { this.slikaSavedTxt = new Date().toLocaleString(); 
                     this.slikaSaved = true;
              })
        .catch(x => {this.slikaSavedTxt = 'greška u spremanju.'; this.slikaSaved = true; });
     
  }

}