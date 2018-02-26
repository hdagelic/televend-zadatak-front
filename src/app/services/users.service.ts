import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService {

  constructor( private http: HttpClient ) { }

  getAllUsers(){
    return this.http.get("http://karta-sverige.se:8080/osoba");
  }

  // Koristimo promise za ovo dohvatiti, tako da je ovo samo da ima

  getUsersDetails(id : number){
    return this.http.get("http://karta-sverige.se:8080/osoba/" + id + "/detalji").toPromise();
  }

}
