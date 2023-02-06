import { NS, Server } from "./Bitburner"

/** @param {NS} ns */
export function getAllServers(ns: NS): Server[] {
	let servers: Server[] = []
	let visited: string[] = []

	walk(ns, 'home', servers, visited)

	return servers
}

function walk(ns: NS, servername: string, servers: Server[], visited: string[]) {
	servers.push(ns.getServer(servername))
	visited.push(servername)

	let children = ns.scan(servername).filter((child) => { return !visited.find((x) => { return x === child }) })

	for (let child of children) {
		walk(ns, child, servers, visited)
	}
}