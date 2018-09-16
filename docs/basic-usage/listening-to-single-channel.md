First, you have to create an instance of the core Twitch client, as outlined in [its own documentation](https://d-fischer.github.io/twitch/docs/basic-usage/creating-instance.html).

Then, using that instance, you create a new {@SingleUserPubSubClient} instance:

```typescript
import { PubSubClient } from 'twitch-pubsub-client';

const pubSubClient = new SingleUserPubSubClient(twitchClient);
```

It's very easy to listen to events in the channel that the `twitchClient` is authenticated for now:

```typescript
import { PubSubSubscriptionMessage } from 'twitch-pubsub-client';

const listener = await pubSubClient.onSubscription((message: PubSubSubscriptionMessage) => {
	console.log(`${message.userDisplayName} just subscribed!`);
});
```

When you don't want to listen to these events anymore, you just remove the listener:

```typescript
listener.remove();
```
