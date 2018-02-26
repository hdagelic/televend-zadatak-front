import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { UsersService } from "../services/users.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-profile-lst',
  templateUrl: './profile-lst.component.html',
  styleUrls: ['./profile-lst.component.css']
})
export class ProfileLstComponent implements OnInit, OnDestroy {

  users;
  userDetails = {}
  userDetails2;
  displayedColumns = ["id", "ime", "email", "tip", "view"];
  
  // Tu spremamo subscriptione da se mozemo unsubscribeati
  private subAllUsers : ISubscription;
  private subUserDetails : ISubscription;

  constructor(private userService: UsersService, 
              public dialog: MatDialog,
              ) {}

  // Dohvati podatke, i spermi subscriptione

  ngOnInit() {
    this.subAllUsers = this.getAllUsers();
  }

  // Izvrsi unsubscribe-ove

  ngOnDestroy() {
    this.subAllUsers.unsubscribe();
  }

  // Zove service za doh
  getAllUsers() {
      return this.userService.getAllUsers().subscribe(x => {
      // console.log(x);
      this.users = x;
    });
  }

  getUsersDetails(id : number) {
    this.userService.getUsersDetails(id).then(x => {
       console.log(x);
       this.userDetails[id] = x; 
       this.userDetails2 = x; 
    });
  }


  // Funkcija za otvaranje dialoga - samo zove "open"
  // i prenosi mu podatke, detelji se ucitavaju u komponenti dijaloga.

  openDialog(user): void {
  
    let dialogRef = this.dialog.open(ShowProfileDialogClass, {
      width: "500px",
      data: user
    });
  }
}

// Za dialog komponentu - show
// ----------------------------

@Component({
  selector: 'show-profile-dialog-class',
  templateUrl: 'show-profile.html',
})

export class ShowProfileDialogClass implements OnInit{

  id;
  user;
  details;
  roleStr;

  constructor(
    public dialogRef: MatDialogRef<ShowProfileDialogClass>,
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
  }

}

