import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// Main kod
export class AppComponent {
   title = 'Aplikacija - osobe ljudi';
   selectedTab = 0;

   // Zapamti na kojem si indexu, da se moze koristiti programsko prebacivanje
   
   tabChanged (e: MatTabChangeEvent) {
     this.selectedTab = e.index;
   }
}

