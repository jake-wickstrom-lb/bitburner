import { NS } from "/lib/Bitburner"
import { TermLogger } from "/lib/Helpers"

/** Weaken the target server one time 
 * 
 * @param {NS} ns 
 * @args {String} target the server to be grown
 * @args {Number} delay wait this long before growing
 * @args {Boolean} debug debug mode
 */
export async function main(ns: NS) {

  let logger = new TermLogger(ns)

  if(typeof ns.args[0] !== 'string') {
    logger.err(`Target server ${ns.args[0]} is not a string! Exiting...`)
    return
  }

  if(typeof ns.args[1] !== 'number') {
    logger.err(`Money Threshold ${ns.args[1]} is not a number! Exiting...`)
    return
  }

  if(typeof ns.args[2] !== 'boolean') {
    logger.err(`Security Threshold ${ns.args[2]} is not a boolean! Exiting...`)
    return
  }

	let [target, delay, debug] = ns.args

	await ns.sleep(delay)
	await ns.weaken(target)

	if(debug) {
		ns.tprint(`W`)
	}
}