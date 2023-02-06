import { NS } from "/lib/Bitburner"
import { TermLogger } from "/lib/Helpers"

/** Hack the target server one time 
 * 
 * @param {NS} ns 
 * @args {String} target the server to be grown
 * @args {Number} delay wait this long before growing
 * @args {Boolean} debug debug mode
 */
export async function main(ns: NS) {
  while(true) {
    await ns.share()
  }
}