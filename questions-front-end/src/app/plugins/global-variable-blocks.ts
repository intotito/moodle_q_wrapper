import { AbstractGlobalVariable } from "./abstract-global-variable";


class VariableBlock extends AbstractGlobalVariable {
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super({ api, data, block, config });
    }

    static get conversionConfig() {

        return {
            export: (data: any) => {
                console.log('Exporting:', data.text);
                return data.text;
            }, // this property of tool data will be used as string to pass to other tool
            import: 'text' // to this property imported string will be passed
        };
    }

    static get toolbox() : any{
        return {
            title: 'Declare Variable',
            icon: '<span class="fa fa-infinity"></span>',
        };
    }

    renderSettings() {
        return [
            {
                label: 'Add Field',
                icon: '<span class="fa fa-clipboard"></span>',
                isDisabled: this.data.last && this.data.last !== 'Operator',
                onActivate: () => this.onActivate('add')
            },
            {
                label: 'Operator',
                icon: '<span class="fa fa-ellipsis-v"></span>',
                isDisabled: (!this.data.last || this.data.last === 'Operator'),
                children: {
                    items: [
                        {
                            title: 'Add',
                            icon: '<span class="fa fa-plus"></span>',
                            onActivate: () => this.onActivate('+')
                        },
                        {
                            title: 'Subtract',
                            icon: '<span class="fa fa-minus"></span>',
                            onActivate: () => this.onActivate('-')
                        },
                        {
                            title: 'Multiply',
                            icon: '<span class="fa fa-times"></span>',
                            onActivate: () => this.onActivate('*')
                        },
                        {
                            title: 'Divide',
                            icon: '<span class="fa fa-divide"></span>',
                            onActivate: () => this.onActivate('/')
                        },
                        {
                            title: 'Modulus',
                            icon: '<span class="fa fa-percent"></span>',
                            onActivate: () => this.onActivate('%')
                        }
                    ],
                }
            },
            {
                label: 'Variable',
                isDisabled: this.data.last && this.data.last !== 'Operator',
                icon: '<span class="fa fa-cogs"></span>',
                children: {
                    items: this.getChildrenItems()
                }
            },
            {
                label: 'Functions',
                isDisabled: this.data.last && this.data.last !== 'Operator',
                icon: '<span class="fa fa-cog"></span>',
                children: {
                    items: this.getFunctionItems()
                }
            }
        ]
    }

    private functions: { name: string, argz: number }[] = [
        { name: 'abs', argz: 1 },
        { name: 'acos', argz: 1 },
        { name: 'acosh', argz: 1 },
        { name: 'asin', argz: 1 },
        { name: 'asinh', argz: 1 },
        { name: 'atanh', argz: 1 },
        { name: 'atan', argz: 1 },
        { name: 'atan2', argz: 2 },
        { name: 'ceil', argz: 1 },
        { name: 'cos', argz: 1 },
        { name: 'cosh', argz: 1 },
        { name: 'exp', argz: 1 },
        { name: 'floor', argz: 1 },
        { name: 'log', argz: 1 },
        { name: 'max', argz: 2 },
        { name: 'min', argz: 2 },
        { name: 'pow', argz: 2 },
        { name: 'random', argz: 0 },
        { name: 'round', argz: 1 },
        { name: 'sin', argz: 1 },
        { name: 'sqrt', argz: 1 },
        { name: 'tan', argz: 1 },
        { name: 'sinh', argz: 1 },
        { name: 'tanh', argz: 1 },

    ];

    private getFunctionItems() {
        let items: { icon: string, title: string, onActivate: () => void }[] = [];
        this.functions.forEach((func: { name: string, argz: number }) => {
            items.push({
                icon: '<span class="fa fa-fx"></span>',
                title: func.name,
                onActivate: () => {
                    let grandChildDiv = this.block.holder.children[0].children[0];
                    const lastChild = grandChildDiv.lastElementChild;
                    grandChildDiv.removeChild(lastChild);
                    grandChildDiv.innerHTML += `<span class="px-2">${func.name} (</span>`;
                    this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: func.name + '(' });
                    for (let i: number = 0; i < func.argz; i++) {
                        grandChildDiv.innerHTML += this.getSDataList();
                        this.data.items.splice(this.data.items.length - 1, 0, { tag: 'INPUT', text: '' });
                        this.data.items.splice(this.data.items.length - 1, 0, { tag: 'DATALIST', text: '' });
                        if (i < func.argz - 1) {
                            grandChildDiv.innerHTML += `<span class="px-2">,</span>`;
                            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: ',' });
                        }
                    }
                    grandChildDiv.innerHTML += `<span class="px-2">)</span>`;
                    this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: ')' });
                    grandChildDiv.appendChild(lastChild);
                    this.refreshItems(grandChildDiv);
                    this.data.last = 'Function';
                    this.api.toolbar.close();
                }
            });
        });
        return items;
    }

    private getChildrenItems(): any[] {
        let items: any[] = [];
        this.config?.randomVariables.forEach((variable: { name: string, indexed: boolean }) => {
            items.push({
                icon: variable.indexed ? '<span class="fa fa-list"></span>' : '<span class="fa fa-dot-circle"></span>',
                title: variable.name,
                onActivate: () => this.onActivate(`${variable.name}:${variable.indexed ? 'list' : 'var'}`)
            });
        });
        console.log(this.data);
        this.data?.globalVariables.forEach((variable: { name: string, isList: boolean }, index: number, array: any[]) => {
            if (index == 0 && this.config?.randomVariables.length > 0) {
                items.push({ type: 'separator' });
            }
            items.push({
                icon: '<span class="fa fa-cogs"></span>',
                title: variable.name,
                onActivate: () => this.onActivate(`${variable.name}:${variable.isList ? 'list' : 'var'}`)
            });
        });
        return items;
    }
}

class ListVariable extends AbstractGlobalVariable {
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super({ api, data, block, config });
    }

    static get toolbox() {
        return [
            {
                title: 'List Variable',
                icon: '<span class="fa fa-ellipsis-h"></span>'
            }
        ];
    }
    protected override getAdditionalElements(): string {
        return `<span class="px-2 h6">${this.separator}</span>
                ${this.getSDataList()}`;
    }

    protected override getStarterElements(): string {
        const html: string = `<span class="px-2 h6">= [</span>`;
        return html;
    }
    protected override getClosureElements(): string {
        const html: string = `<span class="px-2 h6">];</span>`;
        return html;
    }
    protected override getInitialBlockElements(): string {
        const html: string = `${this.getSDataList()}<span class="px-2 h6">${this.separator}</span>    
                                ${this.getSDataList()}
                                `;
        return html;
    }
    renderSettings() {
        return {
            label: 'Add Item',
            icon: '<span class="fa fa-plus"></span>',
            onActivate: () => this.onActivate('add+')
        }
    }

}

class UndeclaredVariable extends VariableBlock {
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super({ api, data, block, config });
        document.addEventListener('undeclared-variable-detected', (event: any) => {
            this.config.undeclaredVariables = event.detail.undeclaredVariables;
            console.log('Undetected Variable detected in Text', event, this.config);
        });
        console.log('Undeclared Variable Block Constructed', '+++++++++++++++++++++++++++++');
    }

    static override get toolbox() {
        return {
            title: 'Undeclared Variable',
            icon: '<span class="fa fa-exclamation"></span>'
        };
    }

    private getSelectOptions(undeclaredVariables: any[]): string {
        let select = `<select class="form-select d-inline" style="width: 100px; onchange="this.style.width = ((this.value.length + 3) * 1) + 'ch';">`
        undeclaredVariables.forEach((variable: any) => {
            select += `<option value="${variable.name}">${variable.name}</option>`;
        });
        select += `</select>`;
        return select;
    }

    public override render(): HTMLElement {
        const container: HTMLDivElement = document.createElement('div');
        container.style.border = '2px solid #77d';
        container.style.borderRadius = '5px';
        container.style.padding = '5px 15px';
        container.innerHTML += this.getSelectOptions(this.config.undeclaredVariables);
        container.innerHTML += this.getStarterElements();
        container.innerHTML += this.getInitialBlockElements();
        container.innerHTML += this.getClosureElements();
        return container;
    }
}

class GradingCriterion extends VariableBlock {
    constructor({ api, data, block, config }: { api: any, data: any, block: any, config: any }) {
        super({ api, data, block, config });
        console.log('Grading Criterion Constructed', '+++++++++++++++++++++++++++++', 'Data:', this.data, data, this.config);
    }

    static override get toolbox() {
        return [
            {
                title: 'Absolute Error',
                icon: '<span class="fa-solid circle-exclamation"></span>',
                data: { 
                    text: '_err == 0',
                    items:[
                        {tag: 'INPUT', text: '_err'},
                        {tag: 'SPAN', text: ' == '},
                        {tag: 'INPUT', text: '0'},
                        {tag: 'SPAN', text: ''},
                    ] 
                },
            }, 
            {
                title: 'Relative Error - 1%',
                icon: '<span class="fa-solid circle-exclamation"></span>',
                data: { 
                    text: '_relerr <= 0.01',
                    items:[
                        {tag: 'INPUT', text: '_relerr'},
                        {tag: 'SPAN', text: ' <= '},
                        {tag: 'INPUT', text: '0.01'},
                        {tag: 'SPAN', text: ''},
                    ] 
                },
            },
            {
                title: 'Relative Error - 5%',
                icon: '<span class="fa-solid circle-exclamation"></span>',
                data: { 
                    text: '_relerr <= 0.05',
                    items:[
                        {tag: 'INPUT', text: '_relerr'},
                        {tag: 'SPAN', text: ' <= '},
                        {tag: 'INPUT', text: '0.05'},
                        {tag: 'SPAN', text: ''},
                    ] 
                },
            }, 
            {
                title: 'Relative Error - 10%',
                icon: '<span class="fa-solid circle-exclamation"></span>',
                data: { 
                    text: '_relerr <= 0.1',
                    items:[
                        {tag: 'INPUT', text: '_relerr'},
                        {tag: 'SPAN', text: ' <= '},
                        {tag: 'INPUT', text: '0.1'},
                        {tag: 'SPAN', text: ''},
                    ] 
                },
            }
        ];
    }

    protected override getStarterElements(): string {
        const html: string = `<span class="px-2 h6">=</span>`;
        return html;
    }
    protected override getClosureElements(): string {
        return "";
    }
    protected override getAdditionalElements(): string {
        return "";
    }

    protected override getInitialBlockElements(): string {
        const html: string = `<input style="width: 45px;" placeholder="criterion" onchange="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                <span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 35px;" placeholder="score" onchange="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                `;
        return html;
    }

    private getElement(tag: string, text: string): string{
        let str: string = '';
        switch(tag){
            case 'INPUT': str = `<input value="${text}" style="width: 45px;" onchange="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`; break;
            case 'SPAN': str = `<span class="px-2 h6">${text}</span>`; break;
            case 'DATALIST': str = this.getSDataList(); break;
        }
        return str;
    }

    public override render(): HTMLElement {
        const container: HTMLDivElement = document.createElement('div');
        console.log('Rendering Grading Criterion', this.data.items);
        this.data.items?.forEach((item: { tag: string, text: string }) => {
            container.innerHTML += this.getElement(item.tag, item.text);
        });
        this.data.last = 'Variable';
        return container;
    }

    protected override onActivate(key: string): void {
        super.onActivate(key);
        this.api.toolbar.close();
    }
}

export { VariableBlock, ListVariable, UndeclaredVariable, GradingCriterion };