export default class PlaceholderTune {
    private api: any;
    private data: any;
    private block: any;
    private config: any;

    constructor({ api, data, block, config }: { api: any; data: any, block: any, config: any }) {
        this.api = api;
        this.data = data;
        this.block = block;
        this.config = config;
        document.addEventListener('placeholder-updated', (event: any) => {
            this.config.placeholders = event.detail.placeholders;
            console.log('Placeholder-Tune Updated:', event, this.config);
        });

    }
    static get isTune() {
        return true;
    }

    private getPlaceholders() {
        const placeholders = this.config.placeholders || [];
        return placeholders.map((placeholder: { part: number, placeholder: string }) => {
            return {
                icon: '<i  class="fa-solid fa-users"></i>',
                title: `Part - ${placeholder.part} - ${placeholder.placeholder}`,
                onActivate: () => {
                    const div = this.block.holder;
                    const grandChildDiv = div.children[0].children[0];
                    grandChildDiv.innerHTML += `{${placeholder.placeholder}}`;
                    this.api.toolbar.close();
                }
            }
        });

    }
    render() {
        return {
            icon: '<span class="fa fa-plus"></span>',
            title: 'Add SubQuestion',
            children: {
                items: this.getPlaceholders()
            }
        }
    }
    save() {
        return this.data;
    }
}
