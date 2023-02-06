import { NS } from "/lib/Bitburner";
import { TermLogger } from "/lib/Helpers";


/** @param {NS} ns */
export async function main(ns: NS) {
  let logger = new TermLogger(ns)

  if(typeof ns.args[0] !== 'number') {
    logger.err(`RAM argument is not a number!`)
    return
  } 

	// How much RAM each purchased server will have
	var ram = ns.args[0]

  // delete old servers which do not have target ram
  for (let servername of ns.getPurchasedServers()) {
    let server = ns.getServer(servername)

    if(server.maxRam <= ram) {
      ns.upgradePurchasedServer(server.hostname, ram)
    }
  }

	// Iterator we'll use for our loop
	var i = 0;

	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	while (i < ns.getPurchasedServerLimit()) {
		// Check if we have enough money to purchase a server
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			let cost = ns.getPurchasedServerCost(ram)
			// If we have enough money, then:
			//  1. Purchase the server
			//  2. Copy our hacking script onto the newly-purchased server
			//  3. Run our hacking script on the newly-purchased server with 3 threads
			//  4. Increment our iterator to indicate that we've bought a new server
			var hostname = ns.purchaseServer("pserv-" + i, ram);
			ns.tprint(`Bought a server with ${ram} GB of RAM for ${cost}`)
			++i;
		}
		await ns.sleep(1000)
	}
}