export class ArrayVariable {

    static get toolbox() {
        return {
            title: 'Array',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3.5" y="4.5" width="17" height="15" stroke="black" fill="none" />
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="11">{.,.}</text>
                </svg>`,
        };
    }


    save(blockElement: any) {
        console.log('Block Element:', blockElement);
        let text: string = '';
        const elements: HTMLElement[] = Array.from(blockElement.children);
        console.log('Elements:', elements);
        for (let element of elements) {
            console.log('Element:', element.tagName);
            // check if input or span
            if (element.tagName === 'INPUT') {
                text += `${(element as HTMLInputElement).value} `;
            } else if(element.tagName === 'SPAN') {
                text += `${element.textContent}`;
            }
        };
        text = text.substring(0, text.lastIndexOf(';') + 1);
        console.log('Arrays:', text);
        const data = {
            text: text
        }
        return data;
    }

    render(): HTMLElement {
        /*
            `<div>
                <input type='text' placeholder='Variable Name' style='border:none width:75px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>={</span>'
                <input type='number' placeholder='1st item' style='border:none width:50px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>,</span>'
                <input type='number' placeholder='2nd item' style='border:none width:50px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>};</span>'
                <span><i class="fa fa-plus"></i>Add</span>
            </div>
            // Add button to add more variables
            add.addEventListener('click', () => {
                container.appendChild(span, input);
            });
        */
        const resize = (event$: any) => {
            console.log('Enema', event$);
            const element = event$.target;
            element.style.width = ((element.value.length + 1) * 8) + 'px';
        }

        const variable = document.createElement('input');
        variable.setAttribute('type', 'text');
        variable.setAttribute('placeholder', 'Variable Name');
        variable.style.border = 'none';
        variable.style.width = '75px';
        variable.addEventListener('input', function() {
            this.style.width = ((second.value.length + 1) * 8) + 'px';
        });
        const first = document.createElement('input');
        first.setAttribute('type', 'text');
        first.setAttribute('placeholder', '1st');
        first.style.border = 'none';
        first.style.width = '35px';
        first.addEventListener('input', () => {
            first.style.width = ((second.value.length + 1) * 8) + 'ch';
        });
        const second = document.createElement('input');
        second.setAttribute('type', 'text');
        second.setAttribute('placeholder', '2nd');
        second.style.border = 'none';
        second.style.width = '35px';
        second.addEventListener('keypress', function() {
            this.style.width = ((second.value.length + 2) * 1) + 'ch';
        });
        const span = document.createElement('span');
        span.style.margin = '0 5px';
        span.style.fontSize = '14';
        span.style.color = '#11F';
        span.innerHTML = `};    #Random Variable`;
        const add = document.createElement('span');
        add.innerHTML = '<span title="Add Item" class="fa fa-plus-circle" style="color:#11F; font-size:24;"></span>';
        add.style.cursor = 'pointer';
        add.style.marginLeft = '5px';
        add.addEventListener('click', () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('placeholder', 'item');
            input.style.border = 'none';
            input.style.width = '50px';
            container.removeChild(span);
            container.removeChild(add);
            container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>,</span>`;
            container.innerHTML += `<input type='text' placeholder='item' style='border:none; width:35px;' onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`;
            container.appendChild(span);
            container.appendChild(add);
        });
        

        const container = document.createElement('div');
 //       container.appendChild(variable);
        container.innerHTML += `<input type='text' placeholder='Variable Name' style='border:none; width:75px;' onkeypress="this.style.width = ((this.value.length + 3) * 1) + 'ch';"/>`
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>={</span>`;
 //       container.appendChild(first);
        container.innerHTML += `<input type='text' placeholder='1st' style='border:none; width:35px;' onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>,</span>`;
        container.innerHTML += `<input type='text' placeholder='2nd' style='border:none; width:35px;' onkeypress="this.style.width = ((this.value.length + 2) * 1) + 'ch';"/>`
 //       container.appendChild(second);
        container.appendChild(span);
        container.appendChild(add);
        container.style.border = '2px solid #ddd';
        container.style.borderRadius = '5px';
        // add padding x padding of 25px and y padding of 5px
        container.style.padding = '5px 25px';
        return container;
        
    }
}