import SingleUserPubSubClient from './SingleUserPubSubClient';
import BasicPubSubClient from './BasicPubSubClient';
import TwitchClient, { extractUserId, UserIdResolvable } from 'twitch';
import PubSubBitsMessage from './Messages/PubSubBitsMessage';
import PubSubSubscriptionMessage from './Messages/PubSubSubscriptionMessage';
import PubSubCommerceMessage from './Messages/PubSubCommerceMessage';
import PubSubWhisperMessage from './Messages/PubSubWhisperMessage';
import { NonEnumerable } from './Toolkit/Decorators';
import PubSubChatModActionMessage from './Messages/PubSubChatModActionMessage';
import PubSubBitsBadgeUnlockMessage from './Messages/PubSubBitsBadgeUnlockMessage';

export default class PubSubClient {
	@NonEnumerable private readonly _rootClient = new BasicPubSubClient();
	@NonEnumerable private readonly _userClients = new Map<string, SingleUserPubSubClient>();

	async registerUserListener(twitchClient: TwitchClient, user?: UserIdResolvable) {
		let userId;
		if (!user) {
			const tokenInfo = await twitchClient.getTokenInfo();
			if (!tokenInfo.userId) {
				throw new Error('Passed a Twitch client that is not bound to a user');
			}
			userId = tokenInfo.userId;
		} else {
			userId = extractUserId(user);
		}

		this._userClients.set(userId, new SingleUserPubSubClient({ twitchClient: twitchClient, pubSubClient: this._rootClient }));
	}

	getUserListener(user: UserIdResolvable) {
		const userId = extractUserId(user);
		if (!this._userClients.has(userId)) {
			throw new Error(`No Twitch client registered for user ID ${userId}`);
		}
		return this._userClients.get(userId)!;
	}

	async onBits(user: UserIdResolvable, callback: (message: PubSubBitsMessage) => void) {
		return this.getUserListener(user).onBits(callback);
	}

	async onBitsBadgeUnlock(user: UserIdResolvable, callback: (message: PubSubBitsBadgeUnlockMessage) => void) {
		return this.getUserListener(user).onBitsBadgeUnlock(callback);
	}

	async onSubscription(user: UserIdResolvable, callback: (message: PubSubSubscriptionMessage) => void) {
		return this.getUserListener(user).onSubscription(callback);
	}

	async onCommerce(user: UserIdResolvable, callback: (message: PubSubCommerceMessage) => void) {
		return this.getUserListener(user).onCommerce(callback);
	}

	async onWhisper(user: UserIdResolvable, callback: (message: PubSubWhisperMessage) => void) {
		return this.getUserListener(user).onWhisper(callback);
	}

	async onModAction(user: UserIdResolvable, channel: UserIdResolvable, callback: (message: PubSubChatModActionMessage) => void) {
		return this.getUserListener(user).onModAction(channel, callback);
	}
}
