import { Component, ElementRef, ViewChild } from '@angular/core';
import { EditorComponent } from "../editor/editor.component";
import EditorJS from '@editorjs/editorjs';
import { XmlBuilderService } from '../../services/xml-builder.service';
import { HtmlSanitizePipe } from "../../pipes/html-sanitize.pipe";
import { Router } from '@angular/router';
import { State } from '../../state';
@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [EditorComponent, HtmlSanitizePipe],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css'
})
export class WizardComponent {
  public nfqLevel: string = '';
  public tag: string = '';
  public currentStep: number = 1;
  public questionParts: number = 1;
  public currentPart: number = 1;
  public randomVariables: { name: string, indexed: boolean }[] = [];
  public globalVariables: { name: string, indexed: boolean }[] = [];
  public undeclaredVariables: { name: string, indexed: boolean }[] = [];
  public localVariables: Array<Array<{ name: string, indexed: boolean }>> = [];
  //  public arrax: {name: string, indexed: boolean}[][] = [];
  gloVarEditor!: EditorJS;
  ranVarEditor!: EditorJS;
  qTextEditors!: EditorJS[];
  gVarEditors!: EditorJS[];
  gCritEditors!: EditorJS[];
  cFeedbackEditors!: EditorJS[];
  pFeedbackEditors!: EditorJS[];
  iFeedbackEditors!: EditorJS[];
  mQuestionEditor!: EditorJS;
  public partsDefinitions: any[] = [];
  public stepDefinitions: any[] = [
    {
      title: 'Step 1: Question Name',
      description: `Name of the question. This will be displayed to the user. It should be a short and descriptive name.
                    A question can be named according to the topic, examination type (quiz or test), or other relevant information.`,
      summary: 'Name',
      tip: 'Exponentiation, Expanding Expression, Chemical Titration, etc.',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 2: Question Parts',
      description: `Number of Sub-Questions. Select the number of sub-questions that will be included in the question.`,
      summary: 'Sub-Questions',
      tip: 'From 1 to 5. ',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 3: Random Variables',
      description: `Random variables in the question. These are the variables that will be randomly generated for each question.
                    Random variables can be used to create unique questions for each student.`,
      summary: 'Random Variables',
      tip: `A random variable has a different syntax from other variables and is set only in the Random variables field. 
            These variables can be defined by assigning a set of elements or by shuffling a list. 
            The probability of selecting each element is equal, so that each element has the same chance of being drawn. There are three types of expressions:
            <ul>
            <li>Set of elements</li>
            <li>Set of numbers</li>
            <li>Shuffled list</li>
            </ul>
            `,
      icon: 'fa fa-user'
    },
    {
      title: 'Step 4: Global Variables',
      description: `Global variables in the question. These are the variables that will be the same for all questions., 
                    Global variables are evaluated after random variables. Other variables to be used for constructing the question 
                    can be assigned here.`,
      summary: 'Global Variables',
      tip: 'Use widgets provided to format the question text.',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 5: Question Parts',
      description: `Answer to the question. This is the correct answer to the question. It should be clear and concise.`,
      summary: 'Answer',
      tip: 'Use widgets provided to format the answer text.',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 6: Question Preview',
      description: `End User Question Preview. The Preview shows the output of the question to the final users. 
                    You can preview the question before saving it or Choose to Modify the Main Question Text.`,
      summary: 'Preview',
      tip: 'Save or Modify Main Question Text.',
      icon: 'fa fa-user'
    }
  ];


  constructor(private xmlBuilder: XmlBuilderService, private router: Router) {
  }
  private createSteps(): any {
    console.log('Question parts:', this.questionParts);
    this.qTextEditors = new Array<EditorJS>(Number(this.questionParts));
    this.gVarEditors = new Array<EditorJS>(Number(this.questionParts));
    this.gCritEditors = new Array<EditorJS>(Number(this.questionParts));
    this.localVariables = new Array(Number(this.questionParts)).fill([]);
    this.cFeedbackEditors = new Array<EditorJS>(Number(this.questionParts));
    this.pFeedbackEditors = new Array<EditorJS>(Number(this.questionParts));
    this.iFeedbackEditors = new Array<EditorJS>(Number(this.questionParts));
    // this.localVariables = 
    for (let i = 0; i < this.questionParts; i++) {
      this.partsDefinitions.push({
        title: `Step ${i + 6}: Sub-Question ${i + 1}`,
        description: `<span class="h5">Part - ${i + 1}</span>. This is a sub-question of the main question. 
                      It should be related to the main question and should be a part of the main question.`,
        summary: `Sub-Question ${i + 1}`,
        tip: 'Use widgets provided to format the sub-question text.',
        icon: 'fa fa-user'
      });
    }
    console.log('Question Parts:', this.questionParts, 'Local Variable size:', this.localVariables.length);
    console.log('Local Variables:', this.localVariables);

  }

  public selectQuestionParts(event: any) {
    this.questionParts = event.target.value;
  }

  private getValue(divId: string, elementName: string, elementType: string): string {
    let element: HTMLElement | null = document.getElementById(divId);
    if (element) {
      let input: any = element.querySelector(`${elementType}[name=${elementName}]`);
      if (elementType === 'input' || elementType === 'textarea' || elementType === 'select') {
        return input?.value;
      }
    }
    return '';
  }

  private questionTextChanged(event: any) {
    this.xmlBuilder.setElement('questiontext', event.target.value);
    this.xmlBuilder.toString();
  }

  public previousStep(event: any) {
    console.log('Previous step');
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public initializeEditors(index: number, component: EditorJS) {
    if (index < 10) {
      if (index === 0) {
        this.mQuestionEditor = component;
      } else
        if (index === 1) {
          this.ranVarEditor = component;
        } else if (index === 2) {
          this.gloVarEditor = component;
        }
    } else if (index < 20) {
      let partIndex: number = index - 10;
      this.qTextEditors[partIndex - 1] = component;
    } else if (index < 30) {
      let partIndex: number = index - 20;
      this.gVarEditors[partIndex - 1] = component;
    } else if (index < 40) {
      let partIndex: number = index - 30;
      this.gCritEditors[partIndex - 1] = component;
    } else if (index < 50) {
      let partIndex: number = index - 40;
      this.cFeedbackEditors[partIndex - 1] = component;
    } else if (index < 60) {
      let partIndex: number = index - 50;
      this.pFeedbackEditors[partIndex - 1] = component;
    } else if (index < 70) {
      let partIndex: number = index - 60;
      this.iFeedbackEditors[partIndex - 1] = component;
    }
    // get editor dom
    let editor = document.getElementById(`editorjs${index}`);
    // set css z-index to index
    let toolbar = editor?.querySelector('.codex-editor');
    // set z-index to index
    toolbar?.setAttribute('style', `z-index: ${100 - index}`);
    console.log('Editor:', editor, 'Toolbar:', toolbar);
  }

  public editorEvent(event: any) {
    if (event.type === 'ready') {
      this.initializeEditors(event.index, event.component);
    } else if (event.type === 'main-question-changed') {
      this.saveEditor(this.mQuestionEditor).then((output: any) => {
        this.xmlBuilder.setElement('questiontext', output.html);
      });
      console.log('Main Question Changed:', event);
    }
    else if (event.type === 'change') {
      console.log("Change Occurred in Editor", event);
    } else if (event.type == 'variable-injected') { // guaranteed to be a sub question editor
      console.log('Variable Injected:', event);
      this.updateVariables(event.variables, event.index - 11);
      // get the relevant 
      console.log('Undeclared Variables:', this.undeclaredVariables);
    } else if (event.type === 'local-variable-declared') {
      this.localVariables[event.index - 21] = event.variables;
      console.log('Local Variable Declared:', event, 'Local Variables:', this.localVariables);
      // search and remove any occurrences of local variables[index-21] in the undeclared variables
      let condA = this.undeclaredVariables.length == 0;
      this.undeclaredVariables = this.undeclaredVariables.filter((undVar: { name: string, indexed: boolean }) => {
        let found: boolean = false;
        this.localVariables[event.index - 21].forEach((locVar: { name: string, indexed: boolean }) => {
          if (locVar.name === undVar.name) {
            found = true;
            return;
          }
        });
        return !found;
      });
      let condB = this.undeclaredVariables.length == 0;
      if (condA && condB) {
      } else {
        const cEvent = new CustomEvent('undeclared-variable-detected', {
          detail: {
            message: 'Undeclared Variable Injected',
            undeclaredVariables: this.undeclaredVariables
          }
        });
        document.dispatchEvent(cEvent);
      }

      const lvEvent = new CustomEvent(`local-variable-update-${event.index - 21}`, {
        detail: {
          message: 'Local Variables Updated',
          localVariables: this.localVariables[event.index - 21],
        }
      });
      document.dispatchEvent(lvEvent);

    }
  }

  private updateVariables(injectedVariables: { name: string, indexed: boolean }[], questionPart: number): void {
    // search for variable declaration in the global variables
    console.log('local variables:', this.localVariables, questionPart);
    injectedVariables.forEach((inVar: { name: string, indexed: boolean }) => {
      let found: boolean = false;
      console.log('Checking:', inVar, '***************************************');
      this.localVariables[questionPart].forEach((locVar: { name: string, indexed: boolean }) => {
        if (locVar.name === inVar.name) {
          found = true;
          console.log('Found in Local Variables:', locVar);
          //      return;
        }
      });
      if (!found) {
        this.globalVariables.forEach((glbVar: { name: string, indexed: boolean }) => {
          if (glbVar.name === inVar.name) {
            found = true;
            console.log('Found in Global Variables:', glbVar);
            //       return;
          }
        });
      }
      if (!found) {
        this.randomVariables.forEach((ranVar: { name: string, indexed: boolean }) => {
          if (ranVar.name === inVar.name) {
            found = true;
            console.log('Found in Random Variables:', ranVar);
            //      return;
          }
        });
      }
      if (!found) {
        this.undeclaredVariables.forEach((undVar: { name: string, indexed: boolean }) => {
          if (undVar.name === inVar.name) {
            found = true;
            console.log('Found in Undeclared Variables:', undVar);
            //   return;
          }
        });
      }

      if (!found) {
        this.undeclaredVariables.push(inVar);
        console.log('Added to Undeclared Variables:', this.undeclaredVariables);
        const event = new CustomEvent('undeclared-variable-detected', {
          detail: {
            message: 'Undeclared Variable Injected',
            undeclaredVariables: this.undeclaredVariables
          }
        });
        document.dispatchEvent(event);
        console.log('Added to Undeclared Variables:', inVar);
      }
    });
  }

  public getQuestionTexts() {
    return this.xmlBuilder.getQuestionTexts();
  }
  private processStep(step: number) {
    switch (step) {
      case 1:
        let name: string = (document.getElementById('name') as HTMLInputElement).value || '';
        console.log("Name from DOM :", name);
        this.nfqLevel = (document.getElementById('nfqLevel') as HTMLSelectElement)?.value || '';
        this.tag = (document.getElementById('tag') as HTMLInputElement)?.value || '';
        console.log('NFQ Level:', this.nfqLevel, 'Tag:', this.tag);
        this.xmlBuilder.createQuestion(name);
        break;
      case 2:
        console.log('Step 2');
        for (let i = 0; i < this.questionParts - 1; i++) {
          this.xmlBuilder.addPart();
        }
        this.createSteps();
        this.xmlBuilder.setElement('answernumbering', this.getValue('numbering', 'answernumbering', 'select'));
        this.xmlBuilder.toString();
        break;
      case 5:
        console.log('Step 5');
        console.log('Step', step, 'Current Step', this.currentStep);
        break;
      case 4:
        console.log('Step 4');
        this.saveEditor(this.gloVarEditor).then((output: any) => {
          this.globalVariables = output.variables;
          this.xmlBuilder.setElement('varsglobal', output.html);
          console.log('Output:', output);
          const event = new CustomEvent('global-variable-update', {
            detail: {
              message: 'Global Variables Updated',
              globalVariables: this.globalVariables
            }
          });
          document.dispatchEvent(event);
          this.xmlBuilder.toString();
        });
        break;
      case 3:
        console.log('Step 3');  
        this.saveEditor(this.ranVarEditor).then((output: any) => {
          this.randomVariables = output.variables;
          this.xmlBuilder.setElement('varsrandom', output.html);
          console.log('Output:', output);
          const event = new CustomEvent('random-variable-update', {
            detail: {
              message: 'Random Variables Updated',
              randomVariables: this.randomVariables
            }
          });
          document.dispatchEvent(event);
          this.xmlBuilder.toString();
          // this.gloVarEditor.reload(this.randomVariables);
        });
        break;
      case 6:
        console.log('Finish');
        // get value from main question editor
        this.saveEditor(this.mQuestionEditor).then((output: any) => {
          this.xmlBuilder.setElement('questiontext', output.html + output.scripts);
          console.log('Main Question Output:', output);
          this.xmlBuilder.toString();
          this.currentStep = 1;
          let xml = this.xmlBuilder.build();
          this.router.navigate(['/main'], { state: { xml: xml, state: State.FROM_WIZARD, 
            nfqLevel: this.nfqLevel, tag: this.tag
           } });
        });
        break;
      default:
        console.log('Invalid step');
    }
  }

  public async nextStep(event: any) {
    console.log('Next step');
    if (this.currentStep === 5) {
      this.xmlBuilder.setPartElement(this.currentPart, 'partindex', this.currentPart - 1);
      let qEdt: EditorJS = this.qTextEditors[this.currentPart - 1];
      let qTOutput: any = await this.saveEditor(qEdt);
      this.xmlBuilder.setPartElement(this.currentPart, 'subqtext', qTOutput.html + qTOutput.scripts);
      let gVarOutput: any = await this.saveEditor(this.gVarEditors[this.currentPart - 1]);
      this.xmlBuilder.setPartElement(this.currentPart, 'vars2', gVarOutput.html);
      let gCritOutput: any = await this.saveEditor(this.gCritEditors[this.currentPart - 1]);
      this.xmlBuilder.setPartElement(this.currentPart, 'correctness', gCritOutput.html);
      let cFeedbackOutput: any = await this.saveEditor(this.cFeedbackEditors[this.currentPart - 1]);
      this.xmlBuilder.setPartElement(this.currentPart, 'correctfeedback', cFeedbackOutput.html);
      let pFeedbackOutput: any = await this.saveEditor(this.pFeedbackEditors[this.currentPart - 1]);
      this.xmlBuilder.setPartElement(this.currentPart, 'partiallycorrectfeedback', pFeedbackOutput.html);
      let iFeedbackOutput: any = await this.saveEditor(this.iFeedbackEditors[this.currentPart - 1]);
      this.xmlBuilder.setPartElement(this.currentPart, 'incorrectfeedback', iFeedbackOutput.html);

      let answerParts: any[] = [
        { id: `home${this.currentPart - 1}`, name: 'placeholder', type: 'input' },
        { id: `home${this.currentPart - 1}`, name: 'answermark', type: 'input' },
        { id: `home${this.currentPart - 1}`, name: 'unitpenalty', type: 'input' },
        { id: `menu${this.currentPart - 1}`, name: 'answer', type: 'input' },
        { id: `menu${this.currentPart - 1}`, name: 'answertype', type: 'select' },
        //        { id: `menu1${this.currentPart - 1}`, name: 'correctfeedback', type: 'textarea' },
        //        { id: `menu1${this.currentPart - 1}`, name: 'partiallycorrectfeedback', type: 'textarea' },
        //        { id: `menu1${this.currentPart - 1}`, name: 'incorrectfeedback', type: 'textarea' },
      ];
      answerParts.forEach((part: any) => {
        this.xmlBuilder.setPartElement(this.currentPart, part.name, this.getValue(part.id, part.name, part.type));
      });
      this.currentPart++;
      this.xmlBuilder.toString();
      if (this.currentPart > this.questionParts) { // Last Part
        let placeholders = this.xmlBuilder.getPlaceholders()
          .filter((placeholder: { part: number, placeholder: string }) => {
            return placeholder.placeholder.length > 0;
          });
        const pEvent = new CustomEvent('placeholder-updated', {
          detail: {
            message: 'Placeholder Updated',
            placeholders: placeholders
          }
        });
        document.dispatchEvent(pEvent);
        this.currentPart = 1;
      } else { // More Parts to traverse
        return;
      }
    }
    this.processStep(this.currentStep++);
  }

  private async saveEditor(editor: EditorJS): Promise<any> {
    let output: any = await editor.save();
    const blocks: any[] = output?.blocks || [];
    console.log('Editor.js Output:', output);
    let html = '';
    let scripts = '';
    let variables: any[] = [];
    let answerCount: number = 0;
    blocks.forEach((block: any, index: number, array: any[]) => {
      console.log('Block:', block);
      if (block.type === 'header') {
        html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      } else if (block.type === 'paragraph') {
        html += `<p>${block.data.text}</p>`;
      } else if (block.type === 'list') {
        html += `<${block.data.style === 'ordered' ? 'o' : 'u'}l>`;
        block.data.items.forEach((item: string) => {
          html += `<li>${item}</li>`;
        });
        html += `</${block.data.style === 'ordered' ? 'o' : 'u'}l>`;
      } else if (block.type === 'table') {
        html += `<table>`;
        block.data.content.forEach((row: any) => {
          html += `<tr>`;
          row.forEach((cell: any) => {
            html += `<td>${cell}</td>`;
          });
          html += `</tr>`;
        });
        html += `</table>`;
      } else if (block.type === 'delimiter') {
        html += `<hr>`;
      } else if (block.type === 'checklist') {
        // make radio buttons if more than one is checked else make a checkbox
        html += `<ul>`;
        let checked: boolean = block.data.items.filter((item: any) => item.checked).length > 1;
        block.data.items.forEach((item: any) => {
          html += `<li>`;
          if (item.checked) {
            html += `<input type=${checked ? 'radio' : 'checkbox'} checked>`;
          } else {
            html += `<input type=${checked ? 'radio' : 'checkbox'}>`;
          }
          html += `${item.text}</li>`;
        });
        html += `</ul>`;
      } else if (block.type === 'code') {
        scripts += block.data.code;
      } else if (block.type === 'answer') {
        // check if position of the last closing tag </*> in the html
        let position = html.lastIndexOf('</');
        let str = block.data.text;
        // replace {_} with {_0}, {_1}, {_2}, ...
        str = str.replace(/{_}/g, `{_${answerCount++}}`);
        html = html.substring(0, position) + str + html.substring(position);
      } else if (block.type === 'variable' || block.type === 'list-variable' || block.type === 'set' || block.type === 'shuffle' ||
        block.type === 'sequence' || block.type === 'criterion') {
        html += `${block.data.text}\n`;
        variables.push(block.data.variable);
      } else if (block.type === 'raw') {
        html += `${block.data.text}\n`;
        variables = variables.concat(block.data.variable);
      } else if (block.type === 'image') {
        html += `<div class="py-2">
                <img src="${block.data.file.url}" alt="${block.data.caption}"/>
                </div>\n
                `;
      }
    });
    return { html: html, scripts: scripts, variables: variables };
  }
}
