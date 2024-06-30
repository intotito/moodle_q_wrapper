import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { readFileSync } from 'fs';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  //imagePath = 'assets/atu.png';
  // valid path to image at assets/images/atu-brand.png
  imagePath = 'assets/images/atu-brand.png';
  msg = 'No File Selected';
  xml = '';

  constructor(private router: Router) { }

  async onFileSelected(event: any) {
    const file:File = event?.target?.files[0];
    if (file) {
      this.msg = file.webkitRelativePath || file.name;
    } else {
      this.msg = 'No File Selected';
    }
    this.xml = await file.text();
 //   console.log(this.xml);
  }

  loadXML(event: any){
    this.router.navigate(['/main'], {state: {xml: this.xml}});
  }
}
