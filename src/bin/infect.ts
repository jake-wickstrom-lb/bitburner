import {NS, Server} from "Bitburner"
import { getAllServers } from 'bin/discover'

/** @param {NS} ns */
export async function main(ns) {
	let network = getAllServers(ns)
	
	for (let server of network) {
		if(server.hasAdminRights !== true) {
			openPorts(ns, server)
		}
		
	}

	ns.write('network.txt', JSON.stringify(network), 'w')
}

/** 
 * @param {NS} ns 
 * @param {Server} server
 */
function openPorts(ns: NS, server: Server) {
	let openCount = 0

	if (ns.fileExists("BruteSSH.exe", "home")) {
		openCount += 1
		ns.brutessh(server.hostname);
	}

	if (ns.fileExists("FTPCrack.exe", "home")) {
		openCount += 1
		ns.ftpcrack(server.hostname);
	}

	if (ns.fileExists("relaySMTP.exe", "home")) {
		openCount += 1
		ns.relaysmtp(server.hostname);
	}

	if (ns.fileExists("SQLInject.exe", "home")) {
		openCount += 1
		ns.sqlinject(server.hostname);
	}

	if (ns.fileExists("HTTPWorm.exe", "home")) {
		openCount += 1
		ns.httpworm(server.hostname);
	}

	if (server.numOpenPortsRequired <= openCount) {
		ns.tprint(`NUKE: ${server.hostname} (${server.numOpenPortsRequired} ports)`)
		ns.nuke(server.hostname)
	}	
}