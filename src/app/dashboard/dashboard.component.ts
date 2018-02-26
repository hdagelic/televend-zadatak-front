import { Component, OnInit, Inject } from "@angular/core";
import { UsersService } from "../services/users.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  users;
  displayedColumns = ["id", "ime", "created_at", "updated_at", "edit", "delete"];
  

  constructor(private userService: UsersService, public dialog: MatDialog) {}


  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(x => {
      console.log(x);
      this.users = x;
    });
  }

  editThisUser(id) {
    console.log(id);
  }

  openDialog(user): void {
    let dialogRef = this.dialog.open(EditProfileDialogClass, {
      width: "500px",
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
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
  glavniSaved = false;
  detaljiSaved = false;
  glavniSavedTxt;
  detaljiSavedTxt;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogClass>,
    private userService: UsersService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUsersDetails(id : number) {
    this.userService.getUsersDetails(id).then(x => {
       this.details = x; 
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

    this.getUsersDetails(this.id);

    // Stvori formu za edit osnovnih podataka
    // Validators.compose([]) - za vise validacija

    this.rForm1 = this.fb.group({
       'ime': [this.user.ime, Validators.required],
       'prezime': [this.user.prezime, Validators.required],
       'email': [this.user.email, Validators.required],
       'username': [this.user.username, Validators.required],
       'role': [this.user.role, Validators.required],
    })

  }

  submitGlavni(data) {

     // Ako forma nije ispravna - ne spremaj
     // - validacija se obavlja automatski
     if (!this.rForm1.valid) return;

     let err = false;

     // Spremi podatke u bazu
     console.log(data);

     // Ispiši je li uspjelo
     if (!err) {
       this.glavniSavedTxt = new Date().toLocaleString();
     } else this.glavniSavedTxt = 'greška u spremanju.';
     this.glavniSaved = true;
  }

}
