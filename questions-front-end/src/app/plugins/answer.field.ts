export class AnswerField {

    static get toolbox() {
        return {
            title: 'Answer',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="15">
                    <path d="M5 5 H19 A2 2 0 0 1 21 7 V15 A2 2 0 0 1 19 17 H9 L5 20 Z" fill="none" stroke="#000" stroke-width="0.6"/>             
                    <path d="M9 10L12 15L18 8" stroke="#000000" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        };
    }


    save(blockElement: any) {
        let text : string = '';
        const elements : HTMLInputElement[] = Array.from(blockElement.getElementsByTagName('input'));
        for(let element of elements){
            if(element.classList.contains('answer')){
                text += '{_} ';
            } else if(element.classList.contains('unit')){
                text += `${element.value}`;
            }
        };
        const data = {
                text: text
        }
        return data;
    }

    render(): HTMLElement {
        /*
                `<input type=text disabled style='margin-right:5px;width:50px;' id='answer'/>
                <input type=text list=browsers id='unit'/>
                <datalist id=browsers >
                <option> Google
                <option> IE9
                </datalist>`
        */
        let element: HTMLInputElement = document.createElement('input');
        element.setAttribute('type', 'text');
        element.className = 'answer';
        element.disabled = true;
        element.style.marginRight = '5px';
        element.style.width = '50px';
        let list: any[] = ['cm', 'mm', 'm', 'km', 'ml', 'l', 'kg', 'g', 'mg', 's', 'min', 'h', 'day', 'week', 'month', 'year'];
        let input: HTMLInputElement = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('list', 'units');
        input.className = 'unit';
        input.style.width = '50px';
        input.style.marginLeft = '5px';
        input.style.border = '1px dashed #ddd';
        let datalist = document.createElement('datalist');
        datalist.setAttribute('id', 'units');
        list.forEach((item: string) => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            datalist.appendChild(option);
        });
        let container = document.createElement('div');
        container.appendChild(element);
        container.appendChild(input);
        container.appendChild(datalist);
        return container;

        /*
                const element = document.createElement('input');
                element.setAttribute('type', 'text');
                element.disabled = true;
                element.style.marginRight = '5px';
                element.style.width = '50px';
                const unit = document.createElement('input');
                unit.setAttribute('type', 'text');
                unit.style.width = '60px';
                unit.style.marginLeft = '5px';
                unit.value = 'units';
        
                // add element and unit intot a single inline div
                const container = document.createElement('div');
                container.appendChild(element);
                container.appendChild(unit);
                return container;
                */
    }
}