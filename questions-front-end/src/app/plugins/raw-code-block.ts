import { AbstractGlobalVariable } from './abstract-global-variable';

export class RawCode extends AbstractGlobalVariable {
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super({ api, data, block, config });
    }
    static get toolbox(): any {
        return {
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
        };
    }
    static get enableLineBreaks() {
        return true;
    }
    protected override getStarterElements(): string {
        return '';
    }
    public override render(): HTMLElement {
        const container: HTMLDivElement = document.createElement('div');
        container.style.border = '2px solid #77d';
        container.style.borderRadius = '5px';
        container.style.padding = '5px 15px';
        // create editable div with 
        container.innerHTML += `<div contenteditable="true" class="m-1" onfocus="this.style.outline='none';"
     onblur="this.style.outline='';" placeholder='Enter your code here'></div>`;
        return container;
    }
}