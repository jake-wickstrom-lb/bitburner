import { NS, Server } from "/lib/Bitburner"
import { TermLogger } from "/lib/Helpers"

const HACK_SCRIPT = '/bin/hack-once.js'
const GROW_SCRIPT = '/bin/grow-once.js'
const WEAKEN_SCRIPT = '/bin/weaken-once.js'

/** 
 * A simple proto-batcher to run on home
 * @param {NS} ns 
 */
export async function main(ns: NS) {

  let logger = new TermLogger(ns)

  if(typeof ns.args[0] !== 'string') {
    logger.err(`Target server ${ns.args[0]} is not a string! Exiting...`)
    return
  }

	// the server we are going to hack
	let target = ns.args[0]

	let po = ns.getPlayer()
	let home = ns.getServer()
	let so = ns.getServer(target)

	// some instinct tells me this is the optimal steal %, 
	// but I don't have energy to prove it rn
	let targetSteal = 1 - (1 / Math.E)

	while(!isPrepared(so)) {

		while(!isMinSecurity(so)) {
			let pid = ns.run(WEAKEN_SCRIPT, getMaxThreads(ns, WEAKEN_SCRIPT, home), target)
			
			while(ns.isRunning(pid, home.hostname)) {
				await ns.sleep(5)
			}

			await ns.sleep(5)
		}
		
		if(!isMaxMoney(so)) {
			let pid = ns.run(GROW_SCRIPT, getMaxThreads(ns, GROW_SCRIPT, home), target)
			
			while(ns.isRunning(pid, home.hostname)) {
				await ns.sleep(5)
			}
		}

		await ns.sleep(5)
	}

	ns.tprint(`${so.hostname} has been successfully prepared!`)

	while(true) {
		
		let ht = ns.formulas.hacking.hackTime(so, po)
		let wt = ns.formulas.hacking.weakenTime(so, po)
		let gt = ns.formulas.hacking.growTime(so, po)

		let hwRatio = Math.ceil(ns.hackAnalyzeSecurity(1, target) / ns.weakenAnalyze(1, home.cpuCores))
		let gwRatio = Math.ceil(ns.growthAnalyzeSecurity(1, target, home.cpuCores) / ns.weakenAnalyze(1, home.cpuCores))

		// HWGW - 200
		let hpid1 = ns.run(HACK_SCRIPT, 1, target, so.hostname, 0, true)

		let wpid1 = ns.run(WEAKEN_SCRIPT, 1 * hwRatio, target)

		ns.sleep(0)

		let gpid1 = ns.run(GROW_SCRIPT)
	}

	
}

/**
 * Returns true if the server is prepared (max money & min security)
 * @param {Server} so 
 */
function isPrepared(so: Server) {
	return isMinSecurity(so) && isMaxMoney(so)
}

/**
 * Returns true if the server is at minimum security
 * @param {NS} ns 
 * @param {Server} so 
 */
function isMinSecurity(so: Server) {
	return so.minDifficulty === so.hackDifficulty
}

/**
 * Returns true if the server is at maximum money
 * @param {Server} so 
 */
function isMaxMoney(so) {
	return so.moneyMax === so.moneyAvailable
}

/**
 * Returns the amount of RAM available on the server
 * @param {Server} so 
 */
function getAvailableRam(so) {
	return so.maxRam - so.ramUsed
}

/**
 * Returns the amount of RAM available on the server
 * @param {string} script
 * @param {Server} so 
 */
function getMaxThreads(ns, script, so) {
	return Math.floor(getAvailableRam(so) / ns.getScriptRam(script))
}