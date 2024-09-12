export class RandomRange {

    static get toolbox() {
        return {
            title: 'Range',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3.5" y="4.5" width="17" height="15" stroke="black" fill="none" />
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="11">{: :}</text>
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
        console.log('Random Range:', text);
        const data = {
            text: text
        }
        return data;
    }

    render(): HTMLElement {
        /*
                `<div>
                <input type='text' placeholder='Variable Name' style='border:none width:75px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>&nbsp;=&nbsp;{&nbsp;</span>'
                <input type='number' placeholder='start' style='border:none width:50px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>&nbsp;:&nbsp;</span>'
                <input type='number' placeholder='end' style='border:none width:50px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>&nbsp:&nbsp;</span>'
                <input type='number' placeholder='interval' style='border:none width:60px;'/>
                <span style='margin:0 5px; font-size:14; text-color:#11F;'>&nbsp};&nbsp;</span>'
                </div>
                `
        */
        const variable = document.createElement('input');
        variable.setAttribute('type', 'text');
        variable.setAttribute('placeholder', 'Variable Name');
        variable.style.border = 'none';
        variable.style.width = '75px';
        const start = document.createElement('input');
        start.setAttribute('type', 'number');
        start.setAttribute('placeholder', 'start');
        start.style.border = 'none';
        start.style.width = '50px';
        const end = document.createElement('input');
        end.setAttribute('type', 'number');
        end.setAttribute('placeholder', 'end');
        end.style.border = 'none';
        end.style.width = '50px';
        const interval = document.createElement('input');
        interval.setAttribute('type', 'number');
        interval.setAttribute('value', '1');
        interval.setAttribute('placeholder', 'interval');
        interval.style.border = 'none';
        interval.style.width = '60px';
        const container = document.createElement('div');
        container.style.border = '2px solid #ddd';
        container.style.borderRadius = '5px';
        container.style.padding = '5px';
        container.appendChild(variable);
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>={</span>`;
        container.appendChild(start);
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>:</span>`;
        container.appendChild(end);
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>:</span>`;
        container.appendChild(interval);
        container.innerHTML += `<span style='margin:0 5px; font-size:14; color:#11F;'>}; # Random Variable</span>`;
        return container;
    }
}