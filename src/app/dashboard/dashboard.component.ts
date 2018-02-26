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
  displayedColumns = ["id", "ime", "created_at", "updated_at", "edit", "delete"];
  
  // Da li refreshati podatke?
  public static Refresh = false;

  constructor(private userService: UsersService, public dialog: MatDialog) {}


  ngOnInit() {
    this.getAllUsers();

    // Refresh, ako se update-a
    setInterval(x => {
      if (DashboardComponent.Refresh) {
         this.getAllUsers(); 
         DashboardComponent.Refresh = false;
       }
     }, 2000);
  }

  getAllUsers() {
    this.userService.getAllUsers().then(x => {
      // console.log(x);
      this.users = x;
    });
  }

  editThisUser(id) {
    // console.log(id);
  }

  deleteUser(id) {
     console.log(id);
     this.userService.deleteUser(id).then(x => {
      // console.log(x);
      this.getAllUsers();
      ProfileLstComponent.Refresh = true;
    });
  }

  openDialog(user): void {
    let dialogRef = this.dialog.open(EditProfileDialogClass, {
      width: "500px",
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
       'id': [this.user.id, Validators.required],
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


     // Spremi podatke u bazu
     data['password'] = '';
     // console.log(data);
     this.userService.updateUser(data.id, data)
        .then(x => { this.glavniSavedTxt = new Date().toLocaleString(); 
                     this.glavniSaved = true;
                     ProfileLstComponent.Refresh = true;
              })
        .catch(x => {this.glavniSavedTxt = 'greška u spremanju.'; this.glavniSaved = true; });
  }

}