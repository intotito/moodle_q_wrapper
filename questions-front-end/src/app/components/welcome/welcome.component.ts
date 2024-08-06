import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WebViewerComponent } from '../web-viewer/web-viewer.component';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, WebViewerComponent, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  //imagePath = 'assets/atu.png';
  // valid path to image at assets/images/atu-brand.png
  imagePath = 'assets/images/atu-brand.png';
  msg = '';
  xml = '';
  file: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.msg = navigation.extras.state['msg'];
      console.log('Data:', this.msg);
    } else {
      console.log('No data');
    }
  }


  async onFileSelected(event: any) {
    this.file = event?.target?.files[0];
    if (this.file) {
      this.msg = `file://...${this.file.name}`;
    } else {
      this.msg = '';
    }
    //   this.xml = await this.file.text();
    //   console.log(this.xml);
  }

  async loadXML(event: any) {
    const uri = new URL(this.msg);
    console.log('URI', uri);
    if (uri.protocol === 'file:') {
      this.xml = await this.file.text();
    } else if (uri.protocol === 'http:' || uri.protocol === 'https:') {
      const response = await fetch(this.msg);
      this.xml = await response.text();
    } else {
      // invalid protocol
      console.log('Invalid protocol');
      return;
    }
    this.router.navigate(['/main'], { state: { xml: this.xml } });
  }
}
