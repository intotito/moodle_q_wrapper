import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-web-viewer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './web-viewer.component.html',
  styleUrl: './web-viewer.component.css'
})
export class WebViewerComponent {
  url: string = 'http://zerofourtwo.net/api/questions';
  loadedUrl: string | null = null;
  sanitizedUrl: SafeResourceUrl | null = null;
  clickedLinkUrl: string | null = null;

  constructor(private sanitizer: DomSanitizer, private router: Router) {
    this.loadUrl();
  }

  loadUrl(): void {
    if (this.url) {
      this.loadedUrl = this.url;
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.clickedLinkUrl = null;

    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: any): void {
    console.log('message received', event.data);
    if (!this.loadedUrl) {
      return;
    }
    if (event.origin !== new URL(this.loadedUrl!).origin) {
      console.log('Ignoring message from different origin:', event.origin, new URL(this.loadedUrl!).origin);
      return;
    }
    //   console.log('message received', event);
    if (event.data.type === 'linkClick') {
      console.log('link clicked', event.data.url);
      this.clickedLinkUrl = event.data.url;
      this.router.navigate(['/'], { state: { msg: event.data.url } });
    } else if (event.data.type === 'init') {
      const docu : any = document.querySelector('iframe')?.contentWindow?.document;
      console.log('document', docu);
      docu.querySelectorAll('a').forEach((link: { addEventListener: (arg0: string, arg1: (e: any) => void) => void; href: any; })  => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.href;
          window.parent.postMessage({ type: 'linkClick', url }, '*');
        });
      });
    }
  }

  ngAfterViewInit(): void {
    console.log('web-viewer component after view init');
    //   window.addEventListener('message', this.onMessage.bind(this), false);
  }

  ngOnInit(): void {
    console.log('web-viewer component initialized');
  }

  ngOnDestroy(): void {
    // remove message event listener
    //   window.removeEventListener('message', (event) => {
    //     console.log('message Removed', event);
    //    });
  }


  public onIframeLoad(event: any): void {
    console.log('iframe loaded', event);
    //const iframe = document.querySelector('iframe');
    const iframe = event.target;
    iframe?.contentWindow?.parent.postMessage('I take god beg u', 'http://zerofourtwo.net');
    if (iframe && iframe.contentWindow) {
      console.log('iframe contentWindow found');
      iframe.contentWindow.parent.postMessage({ type: 'init' }, '*');
      console.log('init message sent');
    }
  }
}
