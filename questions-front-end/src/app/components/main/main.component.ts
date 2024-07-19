import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ItemComponent } from "../item/item.component";
import { XmlParserService } from '../../services/xml-parser.service';
import { AnswerItemComponent } from "../answer-item/answer-item.component";

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [ItemComponent, AnswerItemComponent]
})
export class MainComponent {
  public elements: any[] = [];
  public answers: any[] = [];
  public currentItem: any = null;
  public lastItem: any = null;
  private xmlDocument: any = null;

  constructor(private router: Router, private sanitizer: DomSanitizer, private xmlService: XmlParserService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const xml = navigation.extras.state['xml'];
      const xmlData = this.xmlService.processXML(xml);
      this.xmlDocument = xmlData.document;
      this.elements = xmlData.elements;
      this.answers = xmlData.answers;
    } else {
      // Handle the case where no state is passed
      console.log('No XML state passed');
    }
  }
  ngOnInit(): void {
    var toggler = document?.getElementsByClassName("caret");
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

  answerClicked(event: any, index: any): void {
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
    const found = this.answers.find((answer) => answer.tagName.trim() == name.trim() && answer.getElementsByTagName('partindex').item(0).firstElementChild.textContent.trim() == index.trim());
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

  public isAnswer(element: any): boolean {
    return element.tagName == 'answers';
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

  answerValueChanged(event: any): void {
    console.log('Answer Value Changed:', event.index, event.name, event.value);
    const found = this.answers.find((answer) => answer.getElementsByTagName('partindex').item(0).firstElementChild.textContent.trim() == event.index);
    console.log('Found:', found);
    if (found) {
      const target = found.getElementsByTagName(event.name).item(0);
      console.log('Target:', target);
      if (target) {
        if (target.firstElementChild && target.firstElementChild.nodeName == 'text') {
          target.firstElementChild.textContent = event.value;
        } else {
          target.textContent = event.value;
        }
        console.log('XML:', this.xmlDocument);
      }
    }
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
