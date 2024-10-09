import { get } from "http";

/**
 * This class provides the basic structure for a random variable plugin.
 */
export abstract class AbstractVariableBlock {
    protected api: any;
    protected data: any;
    protected block: any;
    protected config: any;
    protected maxItems: number = 99;
    protected itemsCount: number = 0;

/**
 * This method provides functionality for updating values of the items in the block during
 * destruction and reconstruction of the block. 
 * @param block Block container element
 */
    protected refreshItems(block: HTMLElement): void {
        const elements: HTMLElement[] = Array.from(block.children) as HTMLElement[];
        for (let i: number = 0; i < elements.length; i++){
            let element: HTMLElement = elements[i];
            if (element.tagName === 'INPUT'){
                (element as HTMLInputElement).value = this.data.items[i].text || '';
            } else if (element.tagName === 'SPAN'){
                element.textContent = this.data.items[i].text || '!!Error!!';
            } else if (element.tagName === 'SELECT'){
                (element as HTMLSelectElement).value = this.data.items[i].text || '';
            }
        }
    }

    /**
     * This method provides functionality for saving the data from the block.
     * Each item in the block is saved as an object with the tag and text properties. 
     * This saved items will be used to repopulate the items during reconstruction. 
     * @param blockContent The block container element.
     * @returns The data object containing the variable name and code text.
     */
    protected save(blockContent: HTMLElement): {text: string, variable: {name: string, indexed: boolean}} {
        let items: any = [];
        let text: string = '';
        const elements: HTMLElement[] = Array.from(blockContent.children) as HTMLElement[];
        for (let element of elements) {
            let item: any = {};
            item.tag = element.tagName;
            if (element.tagName === 'INPUT') {
                text += `${(element as HTMLInputElement).value}`;
                item.text = (element as HTMLInputElement).value;
            } else if (element.tagName === 'SELECT') {
                text += `${(element as HTMLSelectElement).value}`;
                item.text = (element as HTMLSelectElement).value;
            } 
            else if (element.tagName === 'SPAN') {
                text += `${element.textContent}`;
                item.text = element.textContent;
            } else if (element.tagName === 'DIV') {
                text += `${element.innerText}`;
                item.text = element.innerText;
            }
             else {
                item.text = '';
            } 
            items.push(item);
        };
        this.data.items = items;
        const data = {
            text: text,
            variable : this.getVariables(text),
      /*      variable: {
                name: text.substring(0, text.indexOf('=')).trim(),
                indexed: this.isIndexed()
            }, 
       */     items: items
        }
        console.log('Saving Block: ', data);
        return data;
    }

    private getVariables(text: string): any {
        // text = A = 1 + 2;B = 2 + 2;C=[2,4,5]
        console.log('Getting Variables:', text);
        let variables: {name: string, indexed: boolean}[] = [];
        // Split text with characters \n, ;
        let lines = text.split(/[\n;]/);
        // For each line, split with = and get the first element
        for (let line of lines){
            let variable = line.split('=')[0].trim();
            let pattern = /=\s*?\[/;
            let isList = pattern.test(line);
            if(line.startsWith('#') || variable === '') continue;
            variables.push({name: variable, indexed: isList});
        }
        return variables.length === 1 ? variables[0] : variables;
    }

    /**
     * This method determines if this block returns an indexable variable.
     * @returns True if the block returns an indexable variable, false otherwise.
     */
    protected isIndexed(): boolean {
        return false;
    }

    /**
     * This method provides functionality for getting the default HTML element for the block.
     * @returns The default HTML element for the block as a string.
     */
    protected abstract getStarterElements(): string;
    /**
     * This method provides functionality for getting the closure HTML element for the block.
     * @returns The closure HTML element for the block as a string.
     */
    protected abstract getClosureElements(): string;
    /**
     * This method provides functionality for adding an extra element to this block. 
     * @returns The extra line of HTML element to be added to the block.
     */
    protected abstract getAdditionalElements(): string;
    /**
     * This method provides functionality for getting the initial block elements.
     * @returns The default block elements.
     */
    protected abstract getInitialBlockElements(): string;

    /**
     * This method return single HTML Element that contains all the block interface.
     * @returns The rendered block container element.
     */
    public render(): HTMLElement {
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

    protected abstract onActivate(key: string): void;
}