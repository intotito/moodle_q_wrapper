export default class UserInputTune {
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
    }
    static get isTune() {
        return true;
    }

    render() {
        return {
            icon: '<i class="fa-regular fa-keyboard"></i>',
            title: `User response ${this.count + 1}`,
            onActivate: () => {
                const div = this.block.holder;
                const grandChildDiv = div.children[0].children[0];
                grandChildDiv.innerHTML += `{*response_${++this.count}}`;
                this.api.toolbar.close();
            }      
        }
    }
    save() {
        return this.data;
    }
}
