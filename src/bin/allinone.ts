import {NS} from "Bitburner";
import {TermLogger} from "/lib/Helpers";

/** 
 * @param {NS} ns 
 * @param {string} target the target server
 * @param {number} moneyThresh how much money the server should have before we hack it
 * @param {number} securityThresh weaken the server below this security before hacking
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

  if(typeof ns.args[2] !== 'number') {
    logger.err(`Security Threshold ${ns.args[2]} is not a number! Exiting...`)
    return
  }

	let target: string = ns.args[0]
	let moneyThresh = ns.args[1]
	let securityThresh = ns.args[2]

	ns.write('args.txt', JSON.stringify([target, moneyThresh, securityThresh]), 'w')

	// Infinite loop that continously hacks/grows/weakens the target server
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target);
		} else {
			// Otherwise, hack it
			await ns.hack(target);
		}

		// small random delay to prevent all scripts from seeing the exact same value every time
		await ns.sleep(Math.random() * 1000)
	}
}