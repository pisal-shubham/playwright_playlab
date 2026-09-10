import {Page} from "@playwright/test"
import { NavBar } from "../components/NavBar.component"
export class HomePage{
    readonly navbar;
    constructor (private page:Page){
        this.navbar= new NavBar(this.page)
    }

    async goto(){
        await this.page.goto('https://playwrightlab.github.io/index.html')
    }
}