export default class AnswerTune {
    private api: any;
    private data: any;
    private block: any;
    private config: any;
    private count: number = 0;

    constructor({ api, data, block, config }: { api: any; data: any, block: any, config: any }) {
        this.api = api;
        this.data = data;
        this.block = block;
        this.config = config;
        console.log('API:', this.api);
        console.log('Data:', this.data);
        console.log('Block:', this.block, this.config);
        document.addEventListener('random-variable-update', (event: any) => {
            this.config.randomVariables = event.detail.randomVariables;
            console.log('Answer-Tune Updated:', event, this.api);
        });


        document.addEventListener('global-variable-update', (event: any) => {
            this.config.globalVariables = event.detail.globalVariables;
            console.log('Answer-Tune Updated: Global Variable(s):', event, this.api);
        });


   //     if (this.config.index > 10 && this.config.index < 20) {
            // definitely a sub question text editor
            document.addEventListener(`local-variable-update-${this.config.index - 11}`, (event: any) => {
                console.log('Event:', event);
                this.config.localVariables = event.detail.localVariables;
                console.log('Answer-Tune Updated:', event, this.config);
            });
   //     }

    }
    static get isTune() {
        return true;
    }

    private getAllVariables() {
        // concat config.globalVariables and config.randomVariables and return an object{icon, title, onactivate} array 
        const globalVariables = this.config.globalVariables || [];
        const randomVariables = this.config.randomVariables || [];
        const localVariables = this.config.localVariables || [];
        const allVariables = globalVariables.concat(randomVariables).concat(localVariables);
        console.log('All Variables:', allVariables);
        return allVariables.map((variable: any) => {
            return {
                icon: '<span  class="fa fa-tag"></span>',
                title: variable.name,
                onActivate: () => {
                    const div = this.block.holder;
                    const grandChildDiv = div.children[0].children[0];
                    // add '[]' if variable is indexed
                    grandChildDiv.innerHTML += `{${variable.name}${variable.indexed ? '[0]' : ''}}`;
                    this.api.toolbar.close();
                }
            }
        });

    }

    render() {
        return {
            // svg with text 'H' and 2point round rectangle
            icon: '<span class="fa fa-plus"></span>',
            title: 'Add',
            children: {
                items: [
                    {
                        icon: '<span  class="fa fa-bookmark"></span>',
                        title: 'Answer',
                        onActivate: () => {
                            const div = this.block.holder;
                            const grandChildDiv = div.children[0].children[0];
                            grandChildDiv.innerHTML += `{_${this.count++}}`;
                            this.api.toolbar.close();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        icon: '<span  class="fa fa-bell"></span>',
                        title: 'Variable',
                        children: {
                            items: this.getAllVariables()
                        }
                    }
                ]
            }
        }

    }

    wrap(blockContent: any) {
        console.log('Block Content:', blockContent);
        // append a simple svg image inside block content
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">`;
        //    blockContent.innerHTML += svg;
        return blockContent;
    }
    // Save the selected data
    save() {
        console.log('------------------ Block:', this.block);
        console.log('------------------ Data:', this.data);
        console.log('------------------ API:', this.api);
        console.log('------------------ Config:', this.config);
        return this.data;
    }
}
