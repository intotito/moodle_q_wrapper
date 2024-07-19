import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class XmlParserService {
  private answers: any[] = [];
  private elements: any[] = [];
  private document: any = null;
  constructor(private sanitizer: DomSanitizer) {

  }

  public getAnswers(): any[] {
    return this.answers;
  }

  public getElements(): any[] {
    return this.elements;
  }

  public processXML(xml: string): any {
    this.answers = [];
    this.elements = [];
    const parser = new DOMParser();
    const document = parser.parseFromString(xml, 'text/xml');
    var question = document.firstElementChild?.firstElementChild;
    question?.childNodes.forEach((node) => {
      if (node.nodeType == 1) {
        if (node.nodeName == 'answers') {
          this.answers.push(node);
        } else {
          this.elements.push(node);
        }
      }
    });
    this.document = document;
    return { document: document, elements: this.elements, answers: this.answers };
  }

  private hasTextPlaceholders(text: any): boolean {
    // use regular expression to check if text contains {#a}, {#b}, {#c}, {_0}, {_1}, {_2}
    const regex = /\{#[a-zA-Z]+?\}/g;
    return text.match(regex) ? true : false;
  }

  private hasInputPlaceholders(text: any): boolean {
    // use regular expression to check if text contains {#a}, {#b}, {#c}, {_0}, {_1}, {_2}
    const regex = /\{_[0-9]+?\}/g;
    return text.match(regex) ? true : false;
  }

  private getText(placeholder: string): string {
    let text: string = '';
    this.answers.forEach((node: any) => {
      let pH: string = '';
      let quest: string = '';
      node.childNodes.forEach((child: any) => {
        if (child.nodeType == 1 && child.tagName == 'placeholder') {
          pH = '{' + child.firstElementChild.textContent.trim() + '}';
        } else if (child.nodeType == 1 && child.tagName == 'subqtext') {
          quest = child.firstElementChild.textContent.trim();
          if (pH == placeholder) {
            text = quest;
          }
        }
      });
    });
    return text;
  }

  public injectTextPlaceholders(text: any): any {
    if (this.hasTextPlaceholders(text)) {
      let str: string = text.toString();
      const regex = /\{#[a-zA-Z]+?\}/g;
      const matches = str.match(regex);
      if (matches) {
        matches.forEach((match: string) => {
          str = str.replace(match, this.getText(match));
        });
      }
      return str;
    }
    return text;
  }

  public injectInputFields(text: any): any {
    if (this.hasInputPlaceholders(text)) {
      let str: string = text.toString();
      const regex = /{_[0-9]+}/g;
      const matches = str.match(regex);
      if (matches) {
        matches.forEach((match: string) => {
          str = str.replace(match, "<input size=\"5\" type=\"text\">");
        });
      }
      return this.byPassHTMLSecurity(str);
    } else {
      return text;
    }
  }

  private byPassHTMLSecurity(text: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
