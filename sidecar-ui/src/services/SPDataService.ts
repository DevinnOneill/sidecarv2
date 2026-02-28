import { getSP } from "../pnpjsConfig";
import { SPFI } from "@pnp/sp";

export class SPDataService {
    private _sp: SPFI;

    constructor() {
        this._sp = getSP();
    }

    // Example method to fetch data from a SharePoint list
    public async getListItems(listTitle: string): Promise<Record<string, unknown>[]> {
        try {
            const items = await this._sp.web.lists.getByTitle(listTitle).items();
            return items;
        } catch (error) {
            console.error(`Error fetching items from list ${listTitle}:`, error);
            throw error;
        }
    }

    // Add more robust methods here that follow the Dataverse / List Integration Plan
}
