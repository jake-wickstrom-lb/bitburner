import { getAllServers } from 'lib/discover.js'
import { NS, Server } from '/lib/Bitburner'
import { TermLogger } from '/lib/Helpers'

/** @param {NS} ns */
export async function main(ns: NS) {
	let script = getScriptToDeploy(ns)
  let network = getAllServers(ns).filter((server) => {
		return server.hostname !== 'home'
	})

	for (let server of network) {
		ns.scp(script, server.hostname)

		if (server.hasAdminRights === true) {
      switch(script) {
        case "/bin/allinone.js":
          deployAllInOne(ns, server, network)
          break
        case "/bin/share.js":
          deployShare(ns, server)
          break
      }
		}
	}
}

/** @param {NS} ns */
function getThreadCount(ns: NS, server: Server, script: string) {
	let scriptram = ns.getScriptRam(script)
	return Math.floor((server.maxRam - ns.getServerUsedRam(server.hostname)) / scriptram)
}

function deployAllInOne(ns: NS, server: Server, network: Server[]) {
  let script = '/bin/allinone.js'
  let threads = getThreadCount(ns, server, script)
  let target = getBestTarget(ns, network)

	let securityThresh = target.minDifficulty + 5
	let moneyThresh = target.moneyMax * 0.95

  if(threads > 0) {
    let execcode = ns.exec(script, server.hostname, threads, target.hostname, moneyThresh, securityThresh)

    if (execcode === 0) {
      ns.tprint(`ERROR: Could not start ${script} on ${server.hostname} (${threads} threads)`)
      ns.write('deploylogs.txt', `Could not start ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
    } else {
      ns.tprint(`DEPLOY: Started ${script} on ${server.hostname} (${threads} threads)`)
      ns.write('deploylogs.txt', `Started ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
    }
  }
}

function deployShare(ns: NS, server: Server) {
  let script = '/bin/share.js'
  let threads = getThreadCount(ns, server, script)

  if (threads > 0) {
    let execcode = ns.exec(script, server.hostname, threads)

    if (execcode === 0) {
      ns.tprint(`ERROR: Could not start ${script} on ${server.hostname} (${threads} threads)`)
      ns.write('deploylogs.txt', `Could not start ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
    } else {
      ns.tprint(`DEPLOY: Started ${script} on ${server.hostname} (${threads} threads)`)
      ns.write('deploylogs.txt', `Started ${script} on ${server.hostname} (${threads} threads)\n`, 'a')
    }
  }
}

function getBestTarget(ns: NS, network: Server[]) {
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
  
  let target = targetlist[0] ?? n00dles

  return target
}

function getScriptToDeploy(ns: NS) {
  switch(ns.args[1]) {
    case 'share': 
      return '/bin/share.js'
    case 'allinone':
    default:
      return '/bin/allinone.js'
  }
}