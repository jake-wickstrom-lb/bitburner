import { getAllServers } from 'lib/discover.js'
import { NS, Server } from '/lib/Bitburner'

/** @param {NS} ns */
export async function main(ns: NS) {
	ns.write('deploylogs.txt', '', 'w')	

	let script = '/scripts/allinone.js'
	let network = getAllServers(ns)

	network = network.filter((server) => {
		return server.hostname !== 'home'
	})

	let n00dles = network.find((server) => {
		return server.hostname === 'n00dles'
	})

	let targetlist = network
		.sort((a, b) => { return b.moneyMax - a.moneyMax })
		.filter((server) => { return server.requiredHackingSkill < (ns.getHackingLevel() / 3) })
		.filter((server) => { return server.hasAdminRights === true })

	if(ns.args[0]) {
		targetlist = network.filter((server) => { return ns.args[0] ? server.hostname === ns.args[0] : true })
	}

	ns.write('deploylogs.txt', `LIST: ${JSON.stringify(targetlist)}\n`, 'a')

	let target = targetlist[0] ?? n00dles
	let securityThresh = target.minDifficulty + 5
	let moneyThresh = target.moneyMax * 0.95

	ns.tprint(`TARGET: ${target.hostname}`)
	ns.tprint(`LEVEL: ${target.requiredHackingSkill}`)
	ns.tprint(`SECURITY TARGET: ${securityThresh}`)
	ns.tprint(`MONEY TARGET: ${moneyThresh}`)

	ns.write('deploylogs.txt', `TARGET: ${target.hostname}\n`, 'a')
	ns.write('deploylogs.txt', `LEVEL: ${ns.getHackingLevel()}\n`, 'a')

	for (let server of network) {
		ns.scp(script, 'home', server.hostname)

		let threads = getThreadCount(ns, server, script)

		if (threads > 0 && server.hasAdminRights === true) {
			let execcode = ns.exec(script, server.hostname, threads, target.hostname, moneyThresh, securityThresh)

			if (execcode === 0) {
				ns.tprint(`ERROR: Could not start ${script} on ${server.hostname} (${threads} threads)`)
				ns.write('deploylogs.txt', `Could not start ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
			} else {
				ns.tprint(`DEPLOY: Started ${script} on ${server.hostname} (${threads} threads)`)
				ns.write('deploylogs.txt', `Started ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
			}
		} else {
			ns.tprint(`ERROR: Could not start ${script} on ${server.hostname} (${threads} threads)`)
			ns.write('deploylogs.txt', `Could not start ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
		}
	}
}

/** @param {NS} ns */
function getThreadCount(ns: NS, server: Server, script: string) {
	let scriptram = ns.getScriptRam(script, server.hostname)
	return Math.floor((server.maxRam - ns.getServerUsedRam(server.hostname)) / scriptram)
}