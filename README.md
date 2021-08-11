# Wa-Shark Framework

### Inspired in [Discord Akairo](https://github.com/discord-akairo/discord-akairo)

## Features

- Nothing, just type update.

<br>

# Examples

```ts
import { SharkClient, CommandHandler } from 'wa-shark';
import { join } from 'path';

export class Client extends SharkClient {
  constructor() {
    super({
      sessionPath: join(__dirname, 'session.json'),
    });
  }

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, 'commands', 'path'),
  });

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, 'listeners', 'path'),
  });

  private async _int(): Promise<void> {
    this.listenerHandler
      .setEmiters({
        commandHandler: this.commandHandler,
        listenerHandler: this.listenerHandler,
        process,
      })
      .loadAll();
    this.commandHandler.loadAll();
  }

  public start(): Promise<void> {
    await this._int();
    super.connect();
  }
}
```

```ts
import { Command } from 'wa-shark';
import { WAChatUpdate, MessageType } from '@adiwajshing/baileys';

export default class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      cooldown: 5e3,
      ratelimit: 1,
      description: {
        title: 'Ping!',
        about: 'Idk, something about the command.',
      },
    });
  }

  public async exec(message: WAChatUpdate) {
    this.client.sendMessage(message.jid, 'Pong!', MessageType.text);
  }
}
```

```ts
import { Listener } from 'wa-shark';

export default class ReadyEvent extends Listener {
  constructor() {
    super('open', {
      event: 'open',
      emitter: 'client',
    });
  }

  public async exec() {
    console.info(`${this.client.user.name} say hi!`);
  }
}
```
