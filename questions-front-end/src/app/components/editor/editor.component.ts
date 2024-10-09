import { Component, AfterViewInit, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import EditorJS, { BlockToolConstructable, ToolConstructable } from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Checklist from '@editorjs/checklist'
import CodeTool from '@editorjs/code';
import { AnswerField } from '../../plugins/answer.field';
import AnswerTune from '../../plugins/answer-tune';
import { VariableBlock, ListVariable, UndeclaredVariable, GradingCriterion } from '../../plugins/global-variable-blocks';
import { SetVariable, ShuffleVariable, SequenceVariable } from '../../plugins/random-variable-block';
import { RawCode } from '../../plugins/raw-code-block';


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewInit {
  @Output()
  public event = new EventEmitter();
  @Input()
  public globalVariables: any[] = [];
  @Input()
  public randomVariables: any[] = [];
  @Input()
  public tools: any[] = [];
  @Input()
  public index: any;
  @Input()
  public tunes: any[] = [];
  @Input()
  public show: any;
  private reloaded: boolean = false;

  private localVariableDefs: { name: string, indexed: boolean, id: string, partIndex: number }[] = [];

  public editor: EditorJS | undefined;


  public getClass(tool: any): any {
    if (tool === 'header') {
      return Header;
    } else if (tool === 'list') {
      return List;
    } else if (tool === 'table') {
      return Table;
    } else if (tool === 'delimiter') {
      return Delimiter;
    } else if (tool === 'checklist') {
      return Checklist;
    } else if (tool === 'code') {
      return CodeTool;
    } else if (tool === 'answer') {
      return AnswerField;
    } else if (tool === 'answer-tune') {
      return AnswerTune;
    } else if (tool === 'variable') {
      return VariableBlock;
    } else if (tool === 'list-variable') {
      return ListVariable;
    } else if (tool === 'set') {
      return SetVariable;
    } else if (tool === 'shuffle') {
      return ShuffleVariable;
    } else if (tool === 'sequence') {
      return SequenceVariable;
    } else if (tool === 'undeclared') {
      return UndeclaredVariable;
    } else if (tool === 'criterion') {
      return GradingCriterion;
    } else if (tool === 'raw') {
      return RawCode;
    }
  }

  private addRawCode(toolkit: any): any {
    const pp: any = {
      class: Paragraph,
      toolbox: {
        title: 'Raw Code',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100">
                <rect width="24" height="24" fill="none" />
                <text x="11.5" y="18" font-size="16" font-family="Arial, sans-serif" text-anchor="middle" fill="gray" font-style="italic">
                  R
                </text>
                <text x="12" y="18" font-size="16" font-family="Arial, sans-serif" text-anchor="middle" fill="black" font-style="italic">
                  R
                </text>
              </svg>`,
      }
    };
    toolkit['paragraph'] = pp;
    return toolkit;
  }

  private getToolkit(): any {
    let toolkit: any = {};
    //   console.log('getToolkit', this.randomVariables);
    this.tools.forEach((tool: any) => {
      toolkit[tool] = {
        class: this.getClass(tool) as unknown as BlockToolConstructable,
        inlineToolbar: true,
        config: {
          randomVariables: this.randomVariables,
          index: this.index
        }
      };
    });
    console.log('Show us Toolkit:', 'Index', this.index, 'Toolkit:', toolkit);
    if (this.show === 'raw') {
      toolkit['paragraph'] = false;
    }
    return toolkit;
  }


  private emitEvent(type: string, component: any) {
    this.event.emit(
      {
        type: type,
        component: component,
        message: 'EditorJS Initialized',
        index: this.index
      }
    );
  }

  private editorChanged($event: any, api: any, type: string) {
    let currentBlock: any = api.blocks.getBlockByIndex(api.blocks.getCurrentBlockIndex());
    let blocksCount: number = api.blocks.getBlocksCount();
    console.log('Current Block: ', currentBlock, 'Current Block Id', currentBlock.id);
    console.log('Editor Changed:', 'Event:', $event, ' My Block index:', api.blocks.getCurrentBlockIndex(), 'Type:', type);
    // check if it is a text editor or a variable editor
    let $events = Array.isArray($event) ? $event : [$event];
    $events.forEach(($evt) => {
      if ($evt.type === 'block-changed') {
        console.log('my editor index:', this.index);
        if (this.index > 10 && this.index < 20) {
          let partIndex: number = this.index - 10 - 1;
          // definitely a sub question editor
          console.log('Block:', currentBlock.save().then((output: any) => {
            console.log('Output:', output);
            if (output.tool === 'paragraph') {
              let text: string = output.data.text;
              // search for symbols {*} in the text
              let pattern = /\{[a-zA-Z][a-zA-Z0-9_\[\]]*\}/g;
              let matches = text.match(pattern);
              console.log('Matches:', matches);
              let variables: any[] = [];
              matches?.forEach((match: string) => {
                variables.push(
                  {
                    name: match.substring(1, match.includes('[') ? match.indexOf('[') : match.length - 1),
                    indexed: match.includes('[')
                  }
                );
                console.log('Match:', variables);
              });
              this.event.emit(
                {
                  type: 'variable-injected',
                  component: this.editor,
                  message: 'Variable Injected',
                  index: this.index,
                  variables: variables
                });
            }
          }));
        } else if (this.index > 20 && this.index < 30) { // local variable editor
          let partIndex: number = this.index - 20 - 1;
          // definitely a local variable editor
          let variables: {name: string, indexed: boolean}[] = [];
 //         let isList: boolean = false;

          if (currentBlock.name === 'variable' || currentBlock.name === 'list-variable') {
            let name = currentBlock.holder.children[0].children[0].children[0].value.trim();
            let type = currentBlock.holder.children[0].children[0].children[1].textContent.trim();
            let pattern = /=\s*?\[/;
            let indexed = pattern.test(type);
            console.log('Block type:', currentBlock);
            variables.push({ name: name, indexed: indexed });
            // check if block id is contained in localvariabledefs
          } else if (currentBlock.name === 'raw') {
            let text = currentBlock.holder.children[0].children[0].innerText.trim();
            let texts = text.split('\n');
            texts.forEach((text: string) => {
              if (text.startsWith('#')) {
                return;
              }
              let name = text.substring(0, text.indexOf('=')).trim();
              let indexed = text.includes('[');
              if (name === '') {
                return;
              }
              variables.push({ name: name, indexed: indexed });
            });
          }
          // remove all local variables with the same id
          this.localVariableDefs = this.localVariableDefs.filter((def: { name: string, indexed: boolean, id: string, partIndex: number }) => {
            return def.id !== currentBlock.id;
          });
          // push the new variables with block id into this.localVariableDefs
          variables.forEach((variable: { name: string, indexed: boolean }) => {
            this.localVariableDefs.push({ name: variable.name, indexed: variable.indexed, id: currentBlock.id, partIndex: partIndex });
          });

          this.event.emit(
            {
              type: 'local-variable-declared',
              component: this.editor,
              message: 'Local Variable Declared',
              index: this.index,
              variables: this.localVariableDefs.map(def => { return { name: def.name, indexed: def.indexed } }),
            });
        }
      } else if ($evt.type === 'block-added' && currentBlock.name !== 'raw') {
        if (this.index > 30 && this.index < 40) { // grading criterion editor
          console.log('Block Added:', currentBlock, 'Blocks Count:', blocksCount);
          this.disableBlockAdding();
        }
      } else if ($evt.type === 'block-removed') {
        console.log('Block Removed:', currentBlock, 'Blocks Count:', blocksCount);
        this.enableBlockAdding();
      }
    });
    //  this.emitEvent(type, this.editor);
  }
  disableBlockAdding() {
    const addButton: any = document.querySelector(`#editor${this.index} .ce-toolbar__plus`);
    console.log('Add Button:', addButton, 'Disable');
    if (addButton) {
      addButton.style.display = 'none'; // Hide the add button
    }
  }

  enableBlockAdding() {
    const addButton: any = document.querySelector(`#editor${this.index} .ce-toolbar__plus`);
    console.log('Add Button:', addButton, 'Enable');
    if (addButton) {
      addButton.style.display = 'block'; // Show the add button
    }
  }

  ngAfterViewInit(): void {
    this.editor = new EditorJS({
      holder: `editorjs${this.index}`,
      inlineToolbar: true,
      autofocus: true,
      minHeight: 0,
      tools: this.getToolkit(),
      onReady: () => this.emitEvent('ready', this.editor),
      onChange: (api, $event) => this.editorChanged($event, api, 'change'),
      tunes: this.tunes,
      defaultBlock: this.show
    });

  }

  private async save() {
    const output = await this.editor?.save();
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
        scripts += `<script>${block.data.code}</script>`;
      } else if (block.type === 'answer') {
        // check if position of the last closing tag </*> in the html
        let position = html.lastIndexOf('</');
        let str = block.data.text;
        // replace {_} with {_0}, {_1}, {_2}, ...
        str = str.replace(/{_}/g, `{_${answerCount++}}`);
        html = html.substring(0, position) + str + html.substring(position);
      } else if (block.type === 'variable' || block.type === 'list-variable' || block.type === 'set' || block.type === 'shuffle' ||
        block.type === 'sequence') {
        html += `${block.data.text}`;
        variables.push(block.data.variable);
      } else if (block.type === 'raw') {
        html += `${block.data.text}`;
      }
    });
    return { html: html, scripts: scripts, variables: variables };
  }
}
