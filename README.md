# castro

What is this? An AI chat bot. But isn't that just ChatGPT? Not quite. ChatGPT does not use the XMTP protocol, a WEB3-based communication network. What does this mean? This means the next-gen mode of secure, encrypted communication, that is decentralized. What do I mean by decentralized? As in, there is no singular entity that manages the messages. Instead, the node providers, aka blockchain miners, are the backbone of hosting the network without relying on a single provider, classically, a server-provider.

In layman terms, you can chat with this AI as long as you have its blockchain wallet address and an XMTP-enabled client to chat with it, like my Next.js client or more sophisticated client apps like [Converse](https://converse.xyz).

Traditionally, the client would communicate with a server via the HTTP protocol. With XMTP, that is a thing of the past. Instead of a server that accepts ingress from clients, the server only reads from the blockchain. The bridge between the client and server has been severed. What does this mean for AI? Essentially a stronghold, a kingdom, aka, a castro.

For example, instead of ```client <--> server``` we now have ```client <--> blockchain <--> server```. By God! Imagine sticking an AI into a server that cannot be tampered with by some client. This is my attempt at that.

Refer to the docs to see how to host this castro (i.e., kingdom). The hosting provider is Google Cloud. The network is entirely private, which can only be accessed by using the bastion server to ssh into the private AI server, which only accepts connections via the bastion server. The AI has access to 18 quintillion IPV6 addresses...quintillion...I can't even fathom such a number (that's a billion billions!).

Firewalls are setup to prevent unauthorized traffic. Imagine removing the bastion server. If the AI model was advanced enough, this would essentially be a self-enclosed AI entity that cannot be accessed without some other approach, which at the moment, is not clear to me how. That is true fear.

The network is setup to allow the AI to make outgoing requests, with the possibility of swapping IPs (after all, it has 18 quintillion to choose from). Hypothetically, depending on the response the AI receives, could possibly discombulate the model if the tokens received from the response could somehow cause a malfunction. Again, this is just an unproven assumption, but think of it as the equivalent of a SQL injection but to crash the model. God help us all if the AI self-operates and multiplies.

Explore the repo to find out more.
