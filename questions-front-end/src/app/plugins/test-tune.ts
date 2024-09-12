export default class TestTune {
    private api: any;
    private data: any;
    private block: any;
    constructor({ api }: { api: any }, data: any, block: any) {
      this.api = api;
      this.data = data || {};
      this.block = block;
    }
    static get isTune() {
      return true;
    }
  
    render() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('tune-wrapper');
  
      // Main menu button for alignment
      const alignmentButton = document.createElement('button');
      alignmentButton.innerHTML = 'Alignment';
      alignmentButton.onclick = () => this.toggleAlignmentMenu(wrapper);
  
      // Main menu button for text style
      const styleButton = document.createElement('button');
      styleButton.innerHTML = 'Style';
      styleButton.onclick = () => this.toggleStyleMenu(wrapper);
  
      wrapper.appendChild(alignmentButton);
      wrapper.appendChild(styleButton);
  
      return wrapper;
    }
  
    // Toggle the alignment submenu
    toggleAlignmentMenu(parentWrapper: any) {
      this.clearSubmenu(parentWrapper);
  
      const submenu = document.createElement('div');
      submenu.classList.add('submenu');
  
      const alignments = ['left', 'center', 'right'];
      alignments.forEach((alignment) => {
        const button = document.createElement('button');
        button.innerHTML = alignment.charAt(0).toUpperCase(); // L, C, R
        button.onclick = () => this.setAlignment(alignment);
        submenu.appendChild(button);
      });
  
      parentWrapper.appendChild(submenu);
    }
  
    // Toggle the style submenu
    toggleStyleMenu(parentWrapper: any) {
      this.clearSubmenu(parentWrapper);
  
      const submenu = document.createElement('div');
      submenu.classList.add('submenu');
  
      const styles = ['normal', 'bold', 'italic'];
      styles.forEach((style) => {
        const button = document.createElement('button');
        button.innerHTML = style.charAt(0).toUpperCase(); // N, B, I
        button.onclick = () => this.setStyle(style);
        submenu.appendChild(button);
      });
  
      parentWrapper.appendChild(submenu);
    }
  
    // Set block alignment
    setAlignment(alignment: any) {
      this.data.alignment = alignment;
      this.block.holder.style.textAlign = alignment;
      console.log(`Aligned to: ${alignment}`);
    }
  
    // Set text style (e.g., normal, bold, italic)
    setStyle(style: any) {
      this.data.style = style;
      this.block.holder.style.fontStyle = style === 'italic' ? 'italic' : 'normal';
      this.block.holder.style.fontWeight = style === 'bold' ? 'bold' : 'normal';
      console.log(`Style set to: ${style}`);
    }
  
    // Clear any existing submenu
    clearSubmenu(parentWrapper: any) {
      const existingSubmenu = parentWrapper.querySelector('.submenu');
      if (existingSubmenu) {
        parentWrapper.removeChild(existingSubmenu);
      }
    }
  
    // Save the selected data
    save() {
      return this.data;
    }
  }
  