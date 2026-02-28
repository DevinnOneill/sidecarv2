import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

let _sp: SPFI | undefined = undefined;

export const getSP = (context?: WebPartContext): SPFI => {
    if (_sp === undefined && context !== undefined) {
        // Setup the PnP JS instance for the entire application
        _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    }

    if (_sp === undefined) {
        throw new Error("PnP JS has not been initialized. Please call getSP(context) in your WebPart's onInit().");
    }

    return _sp;
};
