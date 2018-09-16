If you want to listen to events on different channels with just one PubSub connection, you can use the low-level {@PubSubClient} for that.

First, you have to create and instance and connect the client to Twitch's PubSub interface:

```typescript
import { PubSubClient } from 'twitch-pubsub-client';

const client = new PubSubClient();
await client.connect();
```

Next, you have to set up an event listener so you can react to any events you listen to:

```typescript
client.onMessage((topic: string, message: PubSubMessageData) => {
	const [kind, userId] = topic.split('.', 2);

	if (kind === 'channel-subscribe-events-v1') {
		const subMessage = message as PubSubSubscriptionMessageData;
		if (subMessage.context === 'subgift') {
			console.log(`${subMessage.display_name} just gifted a subscription to ${subMessage.recipient_display_name}!`);
		}
	}
});
```

Then you can listen to any topic you want:

```typescript
const accessToken = 'abc123';
await client.listen(`channel-subscribe-events-v1.${userId}`, accessToken);
```

Later, you can stop listening to any events you're listening to again:

```typescript
await client.unlisten(`channel-subscribe-events-v1.${userId}`);
```
