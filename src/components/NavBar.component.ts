import { Page } from "@playwright/test";

export class NavBar{
    private readonly navBar;
    constructor (private page: Page){
        this.navBar=page.locator("nav#navbar");
    }


    async selectmenu(menu:string){
        await this.navBar.getByRole('link',{name:'Menu'}).click()
        await this.navBar.getByRole('link',{name:menu,exact:true}).click()
    }

    

}