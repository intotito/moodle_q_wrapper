import { AbstractRandomVariable } from "./abstract-random-variable";

class SetVariable extends AbstractRandomVariable{

    constructor({ api, data, block }: { api: any, data: any, block: any }) {
        super({ api, data, block });
    }

    static get toolbox(){
        return {
            title: 'Set',
            icon: '<span class="fa fa-ellipsis-h"></span>'
        }
    }

    protected override getStarterElements(): string {
        const html: string = `<span class="px-2 h6">= {</span>`;
        return html;
    }
    protected override getClosureElements(): string {
        const html: string = `<span class="px-2 h6">};</span>`;
        return html;
    }


}

class SequenceVariable extends SetVariable{
    constructor({ api, data, block }: { api: any, data: any, block: any }) {
        super({ api, data, block });
        this.maxItems = 0;
        this.separator = ':';
    }
    static override get toolbox(){
        return {
            title: 'Sequence',
            icon: '<span class="fa fa-sort-numeric-up"></span>'
        }
    }
       
    protected override getAdditionalElements(): string {
        const html: string =   `<span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 40px;" placeholder="steps" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                `;                    
        return html;
    }

    protected override getInitialBlockElements(): string {
        const html: string =   `<input style="width: 45px;" placeholder="start" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                <span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 35px;" placeholder="end" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                <span class="px-2 h6">${this.separator}</span>    
                                <input style="width: 35px;" placeholder="step" onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>
                                `;                    
        return html;
    }

    protected override onActivate(key: string): void{
        super.onActivate(key);
        this.api.toolbar.close();
    }
}

class ShuffleVariable extends AbstractRandomVariable{
    constructor({ api, data, block }: { api: any, data: any, block: any }) {
        super({ api, data, block });
    }

    static get toolbox(){
        return {
            title: 'Shuffle',
            icon: '<span class="fa fa-random"></span>'
        }
    }
    protected override getStarterElements(): string {
        const html: string = `<span class="px-2 h6">= shuffle([</span>`;
        return html;
    }
    protected override getClosureElements(): string {
        const html: string = `<span class="px-2 h6">]);</span>`;
        return html;
    }

    protected override isIndexed(): boolean{
        return true;
    }
}

export{ShuffleVariable, SequenceVariable, SetVariable}