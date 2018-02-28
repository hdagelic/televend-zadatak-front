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
    let jwt_string = 'JWT ' + localStorage.getItem("ulogiran-token");    
    return this.http.post("http://karta-sverige.se:8080/osoba/" + id, data,

                            { headers: { 'Authorization': jwt_string } }).toPromise();
  }

  // Update detalja jednog usera

  updateUserDetails(id : number, data) {
    let jwt_string = 'JWT ' + localStorage.getItem("ulogiran-token");    
    return this.http.post("http://karta-sverige.se:8080/osoba/" + id + "/detalji", data,
  
                            { headers: { 'Authorization': jwt_string } }).toPromise();
  }

  // Registracija usera

  newUser(data) {
    return this.http.post("http://karta-sverige.se:8080/osoba", data).toPromise();
  }

  // Brisanje usera

  deleteUser(id) {
    let jwt_string = 'JWT ' + localStorage.getItem("ulogiran-token");    
    return this.http.delete("http://karta-sverige.se:8080/osoba/" + id,

                         { headers: { 'Authorization': jwt_string } } ).toPromise();
  }

  // Upload slike

  uploadSlike(id, data) {
    let jwt_string = 'JWT ' + localStorage.getItem("ulogiran-token");    
    return this.http.post("http://karta-sverige.se:8080/osoba/" + id + "/uploadslike", data,
  
                        { headers: { 'Authorization': jwt_string } } ).toPromise();
  }

  // Login - data je "username" i "password" u JSON formatu

   login(data) {
     return this.http.post("http://karta-sverige.se:8080/auth", data).toPromise();
   }
    
   // data - access_token

   getLoginUser(token) {
     let jwt_string = 'JWT ' + token;
     console.log(jwt_string);
     return this.http.get("http://karta-sverige.se:8080/xauthenticated", 
     { headers: { 'Authorization': jwt_string } }).toPromise();
   }

}
