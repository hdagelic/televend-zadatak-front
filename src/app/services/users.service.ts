import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService {

  constructor( private http: HttpClient ) { }

  // Dohvacanje svih usera

  getAllUsers() {
    return this.http.get("http://karta-sverige.se:8080/osoba").toPromise();
  }

  // Dohvacanje detalja

  getUsersDetails(id : number) {
    return this.http.get("http://karta-sverige.se:8080/osoba/" + id + "/detalji").toPromise();
  }
 
  // Update jednog usera

  updateUser(id : number, data) {
    return this.http.post("http://karta-sverige.se:8080/osoba/" + id, data).toPromise();
  }

  // Update detalja jednog usera

  updateUserDetails(id : number, data) {
      return this.http.post("http://karta-sverige.se:8080/osoba/" + id + "/detalji", data).toPromise();
  }

  // Registracija usera

  newUser(data) {
    return this.http.post("http://karta-sverige.se:8080/osoba", data).toPromise();
  }

  // Brisanje usera

  deleteUser(id) {
    return this.http.delete("http://karta-sverige.se:8080/osoba/" + id).toPromise();
  }

  // Upload slike

  uploadSlike(id, data) {
    return this.http.post("http://karta-sverige.se:8080/osoba/" + id + "/uploadslike", data).toPromise();
  }

}
