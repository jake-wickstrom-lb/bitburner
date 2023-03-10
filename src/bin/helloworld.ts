import { NS } from "/lib/Bitburner";
import {TermLogger} from "/lib/Helpers";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const logger = new TermLogger(ns);

    logger.log("Hello from TypeScript o/");
    logger.info("\tEverything seems to be in order :D");
    logger.warn("\tJust showing some colors");
    logger.err("\tFake error, no panik");
}
