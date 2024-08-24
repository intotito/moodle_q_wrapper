import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ItemComponent } from "../item/item.component";
import { XmlParserService } from '../../services/xml-parser.service';
import { AnswerItemComponent } from "../answer-item/answer-item.component";
import { DropdownItemComponent } from '../dropdown-item/dropdown-item.component';
import { InputPipe } from "../../pipes/input.pipe";
import { PlaceholderPipe } from "../../pipes/placeholder.pipe";
import { ValidationService } from '../../services/validation.service';
import { HtmlSanitizePipe } from "../../pipes/html-sanitize.pipe";
import { query } from 'express';
import { RestService } from '../../services/rest.service';
declare var MathJax: any;  // Declare MathJax if included via CDN

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [ItemComponent, AnswerItemComponent, DropdownItemComponent, InputPipe, PlaceholderPipe, HtmlSanitizePipe]
})
export class MainComponent {
  public elements: any[] = [];
  public answers: any[] = [];
  public currentItem: any = null;
  public lastItem: any = null;
  private xmlDocument: any = null;
  public report: string[] = [];
  private header = `<div class="row px-0 mx-0 px-0">
                              <span class="d-none d-md-block col-md-1 px-0 text-info">S/N</span>
                              <span class="col-4 col-md-3 col-lg-2 px-0 text-primary">Title</span>
                              <span class="d-none d-lg-block col-lg-5 px-0 text-primary">Description</span>
                              <span class="col-6 col-lg-3 px-0 text-primary">Summary</span>
                              <span class="col-2 col-md-2 col-lg-1 px-0 text-primary">Status</span>
                            </div>`;

  @ViewChild('htmlElement')
  htmlElement: ElementRef | undefined;

  @ViewChild('questionElement')
  questionElement: ElementRef | undefined;

  @ViewChild('answerElement')
  answerElement: ElementRef | undefined;


  private getFAIcon(status: string): string {
    if (status == 'success') {
      return '<i class="fa-solid fa-circle-check" style="color:#28A745;font-size:32px"></i>';
    } else if (status == 'warning') {
      return '<i class="fa-solid fa-circle-exclamation" style="color:#FFC107;font-size:32px"></i>';
    } else if (status == 'danger') {
      return '<i class="fa-solid fa-circle-xmark" style="color:#DC3545;font-size:32px"></i>';
    } else {
      return '<i class="fa-solid fa-circle-question" style="color:#6C757D;font-size:32px"></i>';
    }
  }

  // toggle .summary element hidden
  public hideSummary(event: any): void {
    const target = event.target;
    const currentTarget = event.currentTarget;
    console.log('Hide Summary:', target.getAttribute('name'), currentTarget.getAttribute('name'), currentTarget?.name);
    if (currentTarget.name == 'summary' || target.getAttribute('name') == 'summary') {
      const modal = document.querySelector('.summary') as HTMLElement;
      modal.style.display = "none";
    }
  }

  public showSummary(event: any): void {
    const modal = document.querySelector('.summary') as HTMLElement;
    modal.style.display = "block";
  }

  public appendReport(report: any): void {
    const html = `<div class="row px-0 mx-0 px-0">
                    <span class="d-none d-md-block col-md-1 px-0">${this.report.length}</span>
                    <span span class="col-4 col-md-3 col-lg-2 px-0"><span class="badge bg-dark">${report.title}</span></span>
                    <span class="d-none d-lg-block col-lg-5 px-0">${report.desc}</span>
                    <span class="col-6 col-lg-3 px-0">${report.summary}</span>
                    <span class="col-2 col-md-2 col-lg-1 px-0">${this.getFAIcon(report.status)}</i></span>
                  </div>`;
    this.report.push(html);
  }

  constructor(private router: Router, private sanitizer: DomSanitizer, private xmlService: XmlParserService, 
    private restService: RestService, private valService: ValidationService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const xml = navigation.extras.state['xml'];
      const xmlData = this.xmlService.processXML(xml);
      this.xmlDocument = xmlData.document;
      this.elements = xmlData.elements;
      this.answers = xmlData.answers;
      //      this.currentItem = this.elements;
    } else {
      // Handle the case where no state is passed
      console.log('No XML state passed');
    }
    const rport = {
      title: 'questiontext',
      desc: 'CSData Section was found to be present.',
      summary: 'CSData Section.',
      status: 'danger'
    };
    this.report.push(this.header);
    this.appendReport(rport);
    this.appendReport(rport);
    this.appendReport(rport);
  }

  public getElementValue(tagName: string): any {
    const element = this.xmlDocument.getElementsByTagName(tagName).item(0);
    if (element) {
      if (element.firstElementChild && element.firstElementChild.nodeName == 'text') {
        return element.firstElementChild.textContent.trim();
      } else {
        return element.textContent.trim();
      }
    }
  }
  ngAfterViewInit() {
    this.renderMath();
  }

  renderMath() {
    if (MathJax) {
      MathJax.typesetPromise([this.htmlElement?.nativeElement]);
    }
  }
  ngOnInit(): void {
    if (document) {
      let element = document.getElementById('sidebarToggle');
      if (element) {
        element.style.display = 'block';
      }
    }
    document.getElementById('sidebarToggle')?.addEventListener('click', function () {
      document.getElementById('sidebar')?.classList.toggle('active');
      document.getElementById('main')?.classList.toggle('active');
    });


    const exp: any = document.getElementById('export');
    exp.addEventListener('click', (event: any) => {
      console.log('Export Clicked:', event);
      this.exportXML(event.currentTarget);
    });

    const save: any = document.getElementById('save');
    save.addEventListener('click', (event: any) => {
      this.save();
    });
  }

  private save() : void {
    this.restService.saveQuestion(this.xmlDocument.firstElementChild?.firstElementChild);
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

  public isDropDown(element: any): boolean {
    if (element.tagName == 'answernumbering') {
      console.log('Element::::::::::::::::::::::::::::::::::::::::::::', element.tagName);
    }
    return element.tagName == 'answernumbering';
  }

  public editName(event: any): void {
    const target = event.currentTarget;
    const parent = target.parentElement;

    // toggle hidden attribute of all the child elements
    parent.querySelectorAll('.btn').forEach((element: any) => {
      element.hidden = !element.hidden;
      console.log('Bi', element.hidden, element);
    });
    // toggle hidden attribute of class 'naming'
    parent?.querySelectorAll('.naming').forEach((element: any) => {
      element.hidden = !element.hidden;
    });

  }

  public getName(): string {
    var question = this.xmlDocument.firstElementChild?.firstElementChild;
    let value = '';
    question?.childNodes.forEach((node: any) => {
      if (node.nodeType == 1) {
        if (node.nodeName == 'name') {
          //       console.log("Node", node.firstElementChild.textContent.trim());
          value = node.firstElementChild?.textContent.trim();
          return;
        }
      }
    });
    return value;
  }

  public answerXClicked(event: any, answer: any): void {
    console.log('Answer Clicked:', event, answer);
    const target = event.currentTarget;
    if (this.lastItem == target) {
      console.log('Same XXXItem Clicked:', target);
      return;
    } if (this.lastItem == null) {
      target.parentElement?.parentElement.querySelector('.selected')?.classList.remove('selected');
    } else {
      this.lastItem.classList.remove('selected');
    }
    target.classList.toggle('selected');

    this.lastItem = target;
    this.currentItem = [answer];
    console.log('Current Item:', this.currentItem);
    if (this.answerElement?.nativeElement.classList.contains('nested')) {
      this.answerElement?.nativeElement.classList.remove('nested');
      this.answerElement?.nativeElement.classList.add('active');
    }
    if (this.questionElement?.nativeElement.classList.contains('active')) {
      this.questionElement?.nativeElement.classList.remove('active');
      this.questionElement?.nativeElement.classList.add('nested');
    }
  }

  public itemXClicked(event: any): void {
    const target = event.currentTarget;
    if (this.lastItem == target) {
      console.log('Same Item Clicked:', target);
      return;
    } if (this.lastItem == null) {
      target.parentElement?.parentElement.querySelector('.selected')?.classList.remove('selected');
    } else {
      this.lastItem.classList.remove('selected');
    }
    target.classList.toggle('selected');
    const name = target.name;
    console.log('Name:', name);
    if (name == 'question') {
      // toggle active class to nested class
      if (this.questionElement?.nativeElement.classList.contains('nested')) {
        this.questionElement?.nativeElement.classList.remove('nested');
        this.questionElement?.nativeElement.classList.add('active');
      }
      if (this.answerElement?.nativeElement.classList.contains('active')) {
        this.answerElement?.nativeElement.classList.remove('active');
        this.answerElement?.nativeElement.classList.add('nested');
      }
    } else if (name == 'answers') {
      // toggle active class to nested class
      this.currentItem = this.answers;
      if (this.answerElement?.nativeElement.classList.contains('nested')) {
        this.answerElement?.nativeElement.classList.remove('nested');
        this.answerElement?.nativeElement.classList.add('active');
      }
      if (this.questionElement?.nativeElement.classList.contains('active')) {
        this.questionElement?.nativeElement.classList.remove('active');
        this.questionElement?.nativeElement.classList.add('nested');
      }
    }
    this.lastItem = target;
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

  public willShow(element: any): boolean {
    return !this.xmlService.isBlacklisted(element.tagName);
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

  public validate(event: any): void {
    const target = event.currentTarget;
    const grandParent = target.parentElement.parentElement;
    // get element with class progress
    const progress = grandParent.querySelector('.progress');
    console.log('Progress', progress.parentElement);
    //   progress.parentElement.classList.remove('active');
    progress.parentElement.classList.toggle('nested');
    target.classList.toggle('disabled');
    // delete everything from report list except the first element
    this.report.splice(1, this.report.length - 1);
    // append report returned from validation service to report list
    this.valService.validateDocument(this.xmlDocument).forEach((report : any) => {
      this.appendReport(report);
    });

    setTimeout(() => {
      target.classList.toggle('disabled');
      progress.parentElement.classList.toggle('nested');
      this.showSummary(null);
    }, 1000);
  }

  public addAnswer(event: any): void {
    this.answers = this.valService.addAnswer(this.xmlDocument);
  }
}

