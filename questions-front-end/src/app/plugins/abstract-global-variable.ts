import { AbstractVariableBlock } from "./abstract-variable-block";

/**
 * This class provides the functionality for creating a global variable block.
 */
export abstract class AbstractGlobalVariable extends AbstractVariableBlock {
    protected separator: string = ',';
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super();
        this.api = api;
        this.data = data;
        this.data.declaredVariables = api ? this.getDeclaredVariables() : [];
    //    this.data.globalVariables = [];
        this.block = block;
        this.config = config;
        console.log("check this out", this.config, this.data);
        document.addEventListener('random-variable-update', (event: any) => {
            this.config.randomVariables = event.detail.randomVariables;
            console.log('Random Variable(s) Updated:', event, this.api);
        });
        if (this.config.index > 20 && this.config.index < 30) { // a local variable editor
            document.addEventListener('global-variable-update', (event: any) => {
                this.config.globalVariables = event.detail.globalVariables;
                console.log('Global Variable(s) Updated:', event, this.api);
            });
        }

    }
    /**
     * This method provides the functionality for retrieving the preceding global variables declared before this
     * block. 
     * @returns A list of declared global variables.
     */
    protected getDeclaredVariables(): { name: string, indexed: boolean }[] {
        let variables: any[] = [];
        let blockCount = this.api.blocks.getBlocksCount();
        //        console.log('Block Count:', blockCount);
        for (let i = 0; i < blockCount; i++) {
            let block = this.api.blocks.getBlockByIndex(i);
            if (block.name === 'variable' || block.name === 'list-variable') {
                let variable = block.holder.children[0].children[0].children[0].value.trim();
                let type = block.holder.children[0].children[0].children[1].textContent.trim();
                let pattern = /=\s*?\[/;
                let isList = pattern.test(type);
                //              console.log('Testing', type, 'Pattern', pattern, 'Result:', isList);
                variables.push({ name: variable, isList: isList });
            }
        }
        //      console.log('Global Variables:', variables);
        return variables;
    }

    /**
     * Retrieves the list or random variables declared through the api configuration. 
     * @returns A list of random variables declared in the block.
     */
    protected getRandomVariables(): { name: string, indexed: boolean }[] {
        return this.config.randomVariables || [];
    }

    /**
     * This method returns a datalist element containing the global and random variables declared in previous blocks.
     * @returns An HTMLInputElement with associated HTMLDataListElement as string.
     */
    protected getSDataList(): string {
        const id: string = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        let html: string = `<input list='${id}' style='width:50px;' onchange="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`;
        html += `<datalist id="${id}" style="padding: 0px 10px;">`;
        html += `<option value="--Random--" disabled></option>`;
        this.getRandomVariables().forEach((option: { name: string, indexed: boolean }) => {
            html += `<option value="${option.name}">${option.name}</option>`;
        });
        html += `<option value="--Global--" disabled></option>`;
        this.config.globalVariables.forEach((option: { name: string, indexed: boolean }) => {
            html += `<option value="${option.name}">${option.name}</option>`;
        });
        html += `<option value="--Declared--" disabled></option>`;
        this.data.declaredVariables.forEach((option: { name: string, indexed: boolean }) => {
            html += `<option value="${option.name}">${option.name}</option>`;
        });
        html += `</datalist>`;
        return html;
    }

    protected override getStarterElements(): string {
        return `<span class="px-2 h6">=</span>`;
    }
    protected override getClosureElements(): string {
        return `<span class="px-2 h6">;</span>`;
    }
    protected override getAdditionalElements(): string {
        return this.getSDataList();
    }
    protected override getInitialBlockElements(): string {
        return '';
    }

    protected onActivate(key: string): void {
        //      console.log('OnActivate Called:', 'Key:', key);
        let grandChildDiv = this.block.holder.children[0].children[0];
        const lastChild = grandChildDiv.lastElementChild;
        grandChildDiv.removeChild(lastChild);
        if (key === 'add') {
            const additional: string = this.getAdditionalElements();
            console.log('Add Item', additional);
            grandChildDiv.innerHTML += additional;
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'INPUT', text: '' });
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'DATALIST', text: '' });
            this.data.last = 'Item';
            this.api.toolbar.close();
        } else if (key === 'add+') {
            const additional: string = this.getAdditionalElements();
            console.log('Add Item', additional);
            grandChildDiv.innerHTML += additional;
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: this.separator });
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'INPUT', text: '' });
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'DATALIST', text: '' });
            this.data.last = 'Item';
        }
        else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            grandChildDiv.innerHTML += `<span class="px-3 h6">${key}</span>`;
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: key });
            this.data.last = 'Operator';
            this.api.toolbar.close();
        } else {
            const indexed: boolean = key.split(':')[1] === 'list';
            const variable: string = key.split(':')[0];
            grandChildDiv.innerHTML += `<span class="px-2 h6">${variable}</span>`;
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: variable });
            if (indexed) {
                grandChildDiv.innerHTML += `<span class="pr-2 h6">[</span>`;
                grandChildDiv.innerHTML += this.getAdditionalElements();
                grandChildDiv.innerHTML += `<span class="pl-2 h6">]</span>`;
                this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: '[' });
                this.data.items.splice(this.data.items.length - 1, 0, { tag: 'INPUT', text: '' });
                this.data.items.splice(this.data.items.length - 1, 0, { tag: 'DATALIST', text: '' });
                this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: ']' });
            }
            this.data.last = 'Variable';
            this.api.toolbar.close();
        }
        grandChildDiv.appendChild(lastChild);
        this.refreshItems(grandChildDiv);
        //        this.itemsCount++;
    }

    /**
 * This method return single HTML Element that contains all the block interface.
 * @returns The rendered block container element.
 */
    public override render(): HTMLElement {
        const container: HTMLDivElement = document.createElement('div');
        container.style.border = '2px solid #77d';
        container.style.borderRadius = '5px';
        container.style.padding = '5px 15px';
        container.innerHTML += `<input type='text' placeholder='Name' style='border:none; width:50px;' onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`
        container.innerHTML += this.getStarterElements();
        container.innerHTML += this.getInitialBlockElements();
        container.innerHTML += this.getClosureElements();
        return container;
    }
}