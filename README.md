# 🤖 JavaScript Discord Bot — Discord.js v14

<div align="center">
  <img src="https://img.shields.io/badge/discord.js-v14.15.0-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js Version">
  <img src="https://img.shields.io/badge/Node.js->=16.9.0-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Developer-themurft-F1C40F?style=for-the-badge" alt="Developer">
</div>

---

## 🌟 Introduction

Welcome to the **JavaScript Discord Bot**! This bot features modular category-based commands, automated welcome & goodbye embeds, an interactive setup wizard for buttons/tickets, and a full-featured simulation economy.

> [!NOTE]  
> All configurations, server settings, logs, and balances are stored locally in a simplified, lightweight JSON file (`database.json`).

---

## 🚀 Key Features

*   **⚙️ Configurable Prefix**: The bot prefix is completely dynamic and controlled directly through the `.env` file.
*   **📁 Category Subfolders**: Clean directory layout (`commands/utility/`, `commands/moderation/`, `commands/config/`, and `commands/economy/`).
*   **📩 Advanced Ticket System**: Deploy interactive support panels with custom embeds and buttons using `!setupticket`.
*   **💰 Rich Economy System**: Earn coins, bank money, transfer funds to peers, and perform cash robberies!
*   **👋 Welcome & Goodbye**: Greet new members and track leaving users with visual embeds containing live counters.

---

## 📁 Project Directory Structure

```text
js/
├── commands/
│   ├── config/       # Configuration commands (setupwelcome, setupticket)
│   ├── economy/      # Economy commands (balance, daily, work, deposit, withdraw, rob, pay)
│   ├── moderation/   # Moderation commands (kick, ban, unban, mute, unmute, clear, purge)
│   └── utility/      # Utility commands (ping, help, avatar, serverinfo, userinfo)
├── database.json     # Local JSON Database
├── index.js          # Main entry file and Event Handlers
├── package.json      # Dependencies and scripts
└── .env              # Environment Configuration
```

---

## 🛠️ Command Reference

### 🔧 Utility Commands
| Command | Description | Example |
| :--- | :--- | :--- |
| `!ping` | Shows bot latency and Discord API latency. | `!ping` |
| `!help` | Displays help menu with commands grouped by category. | `!help` |
| `!avatar [@user]` | Displays the avatar image of a user. | `!avatar @themurft` |
| `!serverinfo` | Displays rich details and statistics about the current server. | `!serverinfo` |
| `!userinfo [@user]` | Displays user information, roles, and status. | `!userinfo @themurft` |

### 🛡️ Moderation Commands
| Command | Description | Example |
| :--- | :--- | :--- |
| `!kick @user [reason]` | Kicks a member and logs it to `database.json`. | `!kick @user Spamming` |
| `!ban @user [reason]` | Bans a member and logs it to `database.json`. | `!ban @user Rules violation` |
| `!unban <userID>` | Unbans a user by their ID. | `!unban 123456789` |
| `!mute @user <time> [reason]` | Silences a member temporarily (e.g. `10m`, `1h`, `2d`). | `!mute @user 1h Stop spamming` |
| `!unmute @user` | Removes active timeout from a member. | `!unmute @user` |
| `!clear <amount>` | Deletes a specified amount of channel messages. | `!clear 20` |
| `!purge <amount>` | Deletes messages (alias of `clear`). | `!purge 20` |

### ⚙️ Configuration Commands
| Command | Description | Example |
| :--- | :--- | :--- |
| `!setupwelcome <#welcome> <#goodbye>` | Configures the welcome and goodbye channels. | `!setupwelcome #welcome #goodbye` |
| `!setupticket` | Launches the interactive wizard to set up the ticket panel. | `!setupticket` |

### 💰 Economy Commands
| Command | Description | Example |
| :--- | :--- | :--- |
| `!balance [@user]` | Shows a user's cash, bank balance, and net worth. | `!balance` |
| `!daily` | Claims your daily 200 coin reward (24-hour cooldown). | `!daily` |
| `!work` | Perform shifts to earn random coins (1-hour cooldown). | `!work` |
| `!deposit <amount / all>` | Deposits cash from your hand into your bank account. | `!deposit 150` |
| `!withdraw <amount / all>` | Withdraws cash from your bank account to your hand. | `!withdraw all` |
| `!rob @user` | Attempt to steal cash from a user (50% success chance). | `!rob @themurft` |
| `!pay @user <amount>` | Pay cash to another member from your hand. | `!pay @themurft 50` |

---

## ⚙️ Installation & Configuration

### 1. Enable Gateway Intents
Make sure the following intents are **enabled** in your application under the **Bot** tab on the [Discord Developer Portal](https://discord.com/developers/applications):
*   **Presence Intent**
*   **Server Members Intent** (Required for user info, welcomes/goodbyes)
*   **Message Content Intent** (Required to parse commands)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment variables
Create a `.env` file in the project directory:
```env
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
PREFIX=!
```

### 4. Running the Bot
```bash
npm start
```

---

## 💬 Support & Feedback

If the code fails, you notice any bugs, or you would like to submit feedback or feature requests, contact us or join our Discord community!

*   👤 **Developer**: **themurft**
*   🌐 **Support Discord**: [https://discord.gg/6C5t995jC6](https://discord.gg/6C5t995jC6)
