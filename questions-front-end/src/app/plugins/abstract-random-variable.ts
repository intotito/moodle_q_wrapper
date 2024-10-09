import { AbstractVariableBlock } from "./abstract-variable-block";

export abstract class AbstractRandomVariable extends AbstractVariableBlock {
    protected separator: string = ',';
    constructor({ api, data, block }: { api: any, data: any, block: any }) {
        super();
        this.api = api;
        this.data = data;
        this.block = block;
    }

    public renderSettings() {
        return {
            icon: '<span class="fa fa-plus"></span>',
            label: 'Add Item',
            isDisabled: this.itemsCount >= this.maxItems,
            onActivate: () => this.onActivate('add')
        };
    }
    
   
    protected override getAdditionalElements(): string {
        const html: string =   `<span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 35px;" placeholder="item" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                `;                    
        return html;
    }
    protected override getInitialBlockElements(): string {
        const html: string =   `<input style="width: 35px;" placeholder="item1" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                <span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 35px;" placeholder="item2" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                `;                    
        return html;
    }

    protected onActivate(key: string): void{
        if(key === 'add'){
            let grandChildDiv = this.block.holder.children[0].children[0];
            const lastChild = grandChildDiv.lastElementChild;
            grandChildDiv.removeChild(lastChild);
            grandChildDiv.innerHTML += this.getAdditionalElements();
            console.log('Add Item', this.data);
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'SPAN', text: this.separator });
            this.data.items.splice(this.data.items.length - 1, 0, { tag: 'INPUT', text: '' });
            grandChildDiv.appendChild(lastChild);
            this.refreshItems(grandChildDiv);
        }
        this.itemsCount++;
    }
}