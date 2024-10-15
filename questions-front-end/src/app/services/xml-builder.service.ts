import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlBuilderService {
  private xmlDocument: XMLDocument | undefined;
  private _question_structure: any = {
    'name': { nested: true, cdata: false, html: false, nullable: false, string: true, symbol: false },
    'questiontext': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: true },
    'generalfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'defaultgrade': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'penalty': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'hidden': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'idnumber': { nested: false, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'shownumcorrect': { nested: false, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'varsrandom': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'varsglobal': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'answernumbering': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'hint': { nested: true, cdata: false, html: true, nullable: true, string: true, symbol: false },
  };

  private _answer_structure: any = {
    'partindex': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'placeholder': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'answermark': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'answertype': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'numbox': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'vars1': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'answer': { nested: true, cdata: true, html: false, nullable: false, string: true, symbol: false },
    'vars2': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'correctness': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'unitpenalty': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'postunit': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'ruleid': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'otherrule': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'subqtext': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: true },
    'feedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
  }

  public setPartElement(part: number, tagName: string, value: any): void {
    let definition = this._answer_structure[tagName];
    if (!this.xmlDocument) {
      return;
    }
    let answer: Element = Array.from(this.xmlDocument.documentElement.getElementsByTagName('answers'))[part - 1];
    if (!definition) {
      console.log('Invalid tag name');
      return;
    } else {
      let element = answer.getElementsByTagName(tagName)[0];
      if (definition.nested && element) {
        let text: Element = element.getElementsByTagName('text')[0];
        if (definition.cdata && text) {
          text.textContent = '';
          const cdataSection = this.xmlDocument.createCDATASection(value);
          if (cdataSection) {
            text.appendChild(cdataSection);
          }
        } else {
          text.textContent = value;
        }
      } else if (element) {
        element.textContent = value;
      }
    }
  }

  public setElement(tagName: string, value: any): void {
    let definition = this._question_structure[tagName];
    if (!definition) {
      console.log('Invalid tag name');
      return;
    } else {
      let element = this.xmlDocument?.documentElement.getElementsByTagName(tagName)[0];
      if (definition.nested && element) {
        let text: Element = element.getElementsByTagName('text')[0];
        if (definition.cdata && text) {
          text.textContent = '';
          const cdataSection = this.xmlDocument?.createCDATASection(value);
          if (cdataSection) {
            text.appendChild(cdataSection);
          }
        } else {
          text.textContent = value;
        }
      } else if (element) {
        element.textContent = value;
      } else {
        console.log('Element not found');
      }
    }
  }

  public createQuestion(name: string) {
    this.xmlDocument = this.getEmptyQuestion();
    this.setElement('name', name);
  }

  public getElement(tagName: string): string {
    let definition = this._question_structure[tagName];
    if (!definition) {
      console.log('Invalid tag name');
      return '';
    }
    let element = this.xmlDocument?.documentElement.getElementsByTagName(tagName)[0];
    if (definition.nested) {
      let text: Element | undefined = element?.getElementsByTagName('text')[0] || undefined;
      return text ? text.textContent || '' : '';
    } else {
      return element ? element.textContent || '' : '';
    }
  }

  public getPartElement(part: number, tagName: string): string {
    let definition = this._answer_structure[tagName];
    if (!this.xmlDocument) {
      return '';
    }
    let answer: Element = Array.from(this.xmlDocument.documentElement.getElementsByTagName('answers'))[part - 1];
    if (!definition) {
      console.log('Invalid tag name');
      return '';
    } else {
      let element = answer.getElementsByTagName(tagName)[0];
      if (definition.nested) {
        let text: Element | undefined = element.getElementsByTagName('text')[0] || undefined;
        return text ? text.textContent || '' : '';
      } else {
        return element ? element.textContent || '' : '';
      }
    }
  }

  public getEmptyQuestion(ansCount: number = 1): XMLDocument {
    let myDocument: XMLDocument = document.implementation.createDocument(null, 'quiz');
    let question: Element = myDocument.createElement('question');
    question.setAttribute('type', 'formulas');
    myDocument.documentElement.appendChild(question);
    Object.entries(this._question_structure).forEach(([key, value]: [string, any]) => {
      let element: Element = myDocument.createElement(key);
      if (value.html) {
        element.setAttribute('format', 'html');
      }
      if (value.nested) {
        let text: Element = myDocument.createElement('text');
        element.appendChild(text);
        if (value.cdata) {
          text.appendChild(myDocument.createCDATASection(''));
        }
      } else {
        if (value.cdata) {
          element.appendChild(myDocument.createCDATASection(''));
        }
      }
      question.appendChild(element);
    });
    for (let i = 0; i < ansCount; i++) {
      let answer: Element = myDocument.createElement('answers');
      Object.entries(this._answer_structure).forEach(([key, value]: [string, any]) => {
        let element: Element = myDocument.createElement(key);
        if (value.html) {
          element.setAttribute('format', 'html');
        }
        if (value.nested) {
          let text: Element = myDocument.createElement('text');
          element.appendChild(text);
          if (value.cdata) {
            text.appendChild(myDocument.createCDATASection(''));
          }
        } else {
          if (value.cdata) {
            element.appendChild(myDocument.createCDATASection(''));
          }
        }
        answer.appendChild(element);
        // append answer before the last element
      });
      question.insertBefore(answer, question.lastElementChild);
    }
    return myDocument;
  }

  public addPart(): void {
    if (!this.xmlDocument) {
      return;
    }
    let question: Element | undefined = this.xmlDocument.documentElement.firstElementChild ?? undefined;
    let answer: Element = this.xmlDocument.createElement('answers');
    Object.entries(this._answer_structure).forEach(([key, value]: [string, any]) => {
      if (!this.xmlDocument) {
        return;
      }
      let element: Element = this.xmlDocument.createElement(key);
      if (value.html) {
        element.setAttribute('format', 'html');
      }
      if (value.nested) {
        let text: Element = this.xmlDocument.createElement('text');
        element.appendChild(text);
        if (value.cdata) {
          text.appendChild(this.xmlDocument.createCDATASection(''));
        }
      } else {
        if (value.cdata) {
          element.appendChild(this.xmlDocument.createCDATASection(''));
        }
      }
      answer.appendChild(element);
      // append answer before the last element
    });
    question?.insertBefore(answer, question.lastElementChild);
  }

  public toString(): string {
    console.log('XML:', this.xmlDocument);
    return this.xmlDocument ? new XMLSerializer().serializeToString(this.xmlDocument) : '';
  }

  public getPartsCount(): number {
    if (!this.xmlDocument) {
      return 0;
    }
    return this.xmlDocument.documentElement.getElementsByTagName('answers').length;
  }

  public getQuestionTexts(): string {
    return this.getQuestionText(this.getElement('questiontext'));
  }

  private getQuestionText(mainQuestionText: string): string {
    let questionText = mainQuestionText;
    const regex1 = /\{_[0-9]+?\}/g;
    for (let i = 0; i < this.getPartsCount(); i++) {
      let questionPart = this.getPartElement(i + 1, 'subqtext');
      let matches = questionPart.match(regex1);
      if (matches) {
        matches.forEach(match => {
          questionPart = questionPart.replace(match, `<input size="5" type="text">`);
        });
      } else {
        // populate according to numbox
        questionPart += '<input size="5" type="text">';
      }
      let placeholder = this.getPartElement(i + 1, 'placeholder');
      if (placeholder && placeholder.trim() != '') {
        if (questionText.includes(`{${placeholder}}`)) {
          questionText = questionText.replace(`{${placeholder}}`, questionPart);
        } else {
          questionText += questionPart;
        }
      } else {
        questionText += questionPart;
      }
    }
    return questionText;
  }

  private validateFormulas() {
    const replacements = [{ from: '&lt;', to: '<' }, { from: '&gt;', to: '>' }];
    let ranVar = this.getElement('varsrandom');
    let globVar = this.getElement('varsglobal');
    replacements.forEach(replacement => {
      ranVar = ranVar.replace(replacement.from, replacement.to);
      globVar = globVar.replace(replacement.from, replacement.to);
    });
    if (ranVar) {
      this.setElement('varsrandom', ranVar);
    }
    if (globVar) {
      this.setElement('varsglobal', globVar);
    }
    for (let i = 0; i < this.getPartsCount(); i++) {
      let var2 = this.getPartElement(i + 1, 'vars2');
      let gradCrit = this.getPartElement(i + 1, 'correctness');
      replacements.forEach(replacement => {
        var2 = var2.replace(replacement.from, replacement.to);
        gradCrit = gradCrit.replace(replacement.from, replacement.to);
      });
      if (var2) {
        this.setPartElement(i + 1, 'vars2', var2);
      }
      if (gradCrit) {
        this.setPartElement(i + 1, 'correctness', gradCrit);
      }
    }
  }

  private validateMarks() {
    let marks = parseFloat(this.getElement('defaultgrade'));
    let sum = 0;
    for (let i = 0; i < this.getPartsCount(); i++) {
      sum += parseFloat(this.getPartElement(i + 1, 'answermark'));
    }
    if (sum != marks) {
      this.setElement('defaultgrade', sum);
    }
  }

  private validateID() {
    // if not set generate a random alphanumeric string
    let id = this.getElement('idnumber');
    if (id.trim() == '') {
      this.setElement('idnumber', `atu_${Math.random().toString(16).substring(2, 9)}`);
    }
  }

  private validateHidden() {
    let hidden = this.getElement('hidden');
    if (hidden.trim() == '') {
      this.setElement('hidden', 0);
    }
  }

  private validateNumBox(part: number) {
    let numbox: number = parseFloat(this.getPartElement(part, 'numbox')) || 1;
    let subqtext = this.getPartElement(part, 'subqtext');
    const regex = /\{_[0-9]+?\}/g;
    let matches = subqtext.match(regex);
    let sum: number = matches ? matches.length : numbox;
    this.setPartElement(part, 'numbox', sum);

  }

  private validatePenalty() {
    let penalty: number = parseFloat(this.getElement('penalty')) || 0.33333;
    this.setElement('penalty', penalty);
  }

  private validateRuleId(part: number) {
    let ruleid = this.getPartElement(part, 'ruleid') || 1;
    this.setPartElement(part, 'ruleid', ruleid);
  }

  private validateUnitPenalty(part: number) {
    let answermark = parseFloat(this.getPartElement(part, 'answermark')) || 0;
    let unitpenalty = parseFloat(this.getPartElement(part, 'unitpenalty')) || (answermark / 10);
    this.setPartElement(part, 'unitpenalty', unitpenalty);
  }

  protected validateXML(): void {
    this.validateMarks();
    this.validateID();
    this.validatePenalty();
    this.validateFormulas();
    this.validateHidden();
    for (let i = 0; i < this.getPartsCount(); i++) {
      this.validateNumBox(i + 1);
      this.validateRuleId(i + 1);
      this.validateUnitPenalty(i + 1);
    }
  }

  public getPlaceholders(): { part: number, placeholder: string }[] {
    let placeholders: { part: number, placeholder: string }[] = [];
    let qParts = this.getPartsCount();
    for (let i = 0; i < qParts; i++) {
      let placeholder = this.getPartElement(i + 1, 'placeholder') || '';
      placeholders.push({ part: i + 1, placeholder: placeholder.trim() });
    }
    return placeholders
  }

  public build(): string {
    if (!this.xmlDocument) {
      return '';
    }
    this.validateXML();
    this.injectUserResponse();
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(this.xmlDocument);
    console.log('XML:', xml);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getElement('name').replace(/ /g, '_') + '.xml';
    a.click();
    a.remove();
    return xml;
  }

  private injectUserResponse(): void {
    console.log('Injecting User Response');
    let partCount = this.getPartsCount();
    let globals =  this.getElement('varsglobal') + `\n# **** Auto-Generated Variables ****\n`;
    let willInject: boolean = false;
    for (let i = 0; i < partCount; i++) {
      let inPart: boolean = false;
      let feedbacks = [
        { tag: 'correctfeedback', feedback: this.getPartElement(i + 1, 'correctfeedback') },
        { tag: 'partiallycorrectfeedback', feedback: this.getPartElement(i + 1, 'partiallycorrectfeedback')},
        { tag: 'incorrectfeedback', feedback: this.getPartElement(i + 1, 'incorrectfeedback')}
      ];
      feedbacks.forEach((feedback : {tag: string, feedback: string}) => {
        const regex = /\{\*response\_[0-9]+\}/gm;
        let fBack = feedback.feedback;
        let matches = fBack.match(regex);
        if (!matches) return;
        matches.forEach(match => {
          // replace {*response_1} with {atu_input1[0]}
          let index = Number(match.match(/\d+/));
          fBack = fBack.replace(match, `{atu_input${i + 1}[${index - 1}]}`);
          this.setPartElement(i + 1, feedback.tag, fBack);
        });
        willInject = true;
        let numbox = parseFloat(this.getPartElement(i + 1, 'numbox'));
        if (!inPart) { // if automated variables have not been created for this part
          // Create a global variable to hold user's response
          let gVariable = `atu_input${i + 1} = [`; // global variable
          let locals = this.getPartElement(i + 1, 'vars2').trim() + `\n# **** Auto-Generated Variables ****\n`;
          for (let j = 0; j < numbox; j++) {
            let lVariable = `atu_input${i + 1}[${j}] = _r[${j}];\n`; // local variable
            gVariable += '0';
            if (j < numbox - 1) {
              gVariable += ', ';
            }
            locals += lVariable;
          }
          locals += `# **** End of Auto-Generated Variables ****`;
          this.setPartElement(i + 1, 'vars2', locals);
          gVariable += '];\n';
          globals += gVariable;
          inPart = true;
        }
        inPart = true;
      });     
    }
    if(willInject) {
      globals += `# **** End of Auto-Generated Variables ****`;
      this.setElement('varsglobal', globals);
    }
  }
}
