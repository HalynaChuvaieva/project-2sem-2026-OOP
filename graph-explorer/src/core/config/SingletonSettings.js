class AppSettings {
  constructor() {
    if (AppSettings.instance) {
      return AppSettings.instance;
    }
    this.theme = 'light';
    this.showGrid = true;
    AppSettings.instance = this;
  }
  
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
export const settingsInstance = new AppSettings();