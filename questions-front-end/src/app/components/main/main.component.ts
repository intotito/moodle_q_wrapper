import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { last } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  public elements: any[] = [];
  public answers: any[] = [];
  public currentItem: any[] = [];
  public lastItem: any = null;
  private xmlDocument: any = null;

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation:', this.router);
    if (navigation?.extras.state) {
      const xml = navigation.extras.state['xml'];
      this.processXML(xml);
      //     console.log('Received XML:', xml);
      // Use the xml as needed
    } else {
      // Handle the case where no state is passed
      console.log('No XML state passed');
    }
  }
  ngOnInit(): void {
    var toggler = document.getElementsByClassName("caret");
    console.log('Toggler:', toggler);
    var i: number;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", (event: any) => {
        const target = event.currentTarget as HTMLElement;
        console.log('Clicked', 'Awumen O');
        target.parentElement?.querySelector(".nested")?.classList?.toggle("active");
        target.classList?.toggle("caret-down");
        if (this.lastItem != null && this.lastItem != target) {
          this.lastItem.classList?.remove("selected");
        }
        if (this.lastItem != target) {
          target.classList?.toggle("selected");
        }
        if (target.textContent?.trim() == 'Question') {
          this.currentItem = this.elements;
        } else {
          this.currentItem = this.answers;
        }
        this.lastItem = target;
      });
    }

    const exp: any = document.getElementById('export');
    exp.addEventListener('click', (event: any) => {
      console.log('Export Clicked:', event);
      this.exportXML(event.currentTarget);
    });


  }

  answerClicked(event: any): void {

  }

  itemClicked(event: any): void {
    const target: any = event.currentTarget;
    if (this.lastItem == target) {
      console.log('Same Item Clicked:', target);
      return;
    } else if (this.lastItem != null) {
      this.lastItem.classList.remove('selected');
    }
    console.log('Item Clicked:', event.currentTarget);

    const name = target.textContent;
    console.log('Search', name);
    const found = this.elements.find((element) => element.tagName.trim() == name.trim());
    target.classList.toggle('selected');
    if (found) {
      this.currentItem = [];
      this.currentItem.push(found);
      console.log('Found:', found);
    } else {
      console.log('Not Found:', name);
    }
    this.lastItem = target;
  }

  getPlaceHolders(element: any): string {
    console.log('Element:', element);
    let placeholders = '';
    element.forEach((node: any) => {
      if (node.nodeType == 1 && node.tagName == 'questiontext') {
        // use regular expression to extract strings like {#a}, {#b}, {#c}
        const regex = /{#[a-zA-Z]}/g;
        const matches = node.textContent.match(regex);
        console.log('Matches:', matches);
        let holders: string[] = [];
        if (matches) {
          matches.forEach((match: string) => {
            holders.push(match);
          });
        }

        placeholders += node.tagName + ', ';
      }
    });
    return placeholders;
  }

  r(text: any): any {
    // use regular expression to check if text contains {#a}, {#b}, {#c}, {_0}, {_1}, {_2}

    const regx = /\{#[a-zA-Z]+?\}|\{_[0-9]+?\}/g;
    if (!text.match(regx)) {
      return text;
    }

    let str: string = text.toString();
    this.answers.forEach((node: any) => {
      let pH: string = '';
      let quest: string = '';
      node.childNodes.forEach((child: any) => {

        if (child.nodeType == 1 && child.tagName == 'placeholder') {
          pH = '{' + child.firstElementChild.textContent.trim() + '}';
        } else if (child.nodeType == 1 && child.tagName == 'subqtext') {
          quest = child.firstElementChild.textContent.trim();
          str = str.replace(pH, quest);
        }


      });
    });
    const regex = /{_[0-9]}/g;
    const matches = str.match(regex);
    if (matches) {
      matches.forEach((match: string) => {
        str = str.replace(match, "<input size=\"5\" type=\"text\">");
      });
    }
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

  processXML(xml: string): void {
    const parser = new DOMParser();
    const document = parser.parseFromString(xml, 'text/xml');
    const name = document.getElementsByTagName('name')[0];
    var text = name.firstElementChild;

    var question = document.firstElementChild?.firstElementChild;
    question?.childNodes.forEach((node) => {
      if (node.nodeType == 1) {
        //      console.log('Node:', node);
        if (node.nodeName == 'answers') {
          this.answers.push(node);
        } else {
          this.elements.push(node);
        }
      }
    });
    //   this.currentItem = this.elements;
    console.log('------------------', this.elements[1]);
    //  placeholders: [] = this.getPlaceHolders(this.elements);
    this.xmlDocument = document;
  }

  inputValueChanged(event: any): void {
    console.log('Input Value Changed:', event);
    const target = event.currentTarget;
    const name = target.name;
    const newValue = target.value;
    console.log('Value', newValue, 'Name:', name, 'Target:', target);
    const found = this.elements.find((element) => element.tagName.trim() == name);
    console.log('Found:', found);
    if (found) {
      if (found.firstElementChild && found.firstElementChild.nodeName == 'text') {
        found.firstElementChild.textContent = newValue;
      } else {
        found.textContent = newValue;
      }
      console.log('XML:', this.xmlDocument);
    }
  }

  exportXML(target: any): void {
    console.log('Exporting XML:', target);
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(this.xmlDocument);
    console.log('XML:', xml);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.xml';
    a.click();
    // remove a from the dom
    a.remove();
  }
}
