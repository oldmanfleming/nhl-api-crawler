# nhl-api-crawler

This package provides simple async functions for crawling and enriching the NHL's public APIs into a useful format.

# Motivation

As some may be surprised to learn, nhl.com exposes public, undocumented APIs that can be called by anyone. Sadly, the data these APIs expose is incredibly convoluted and inadequate. For example, each event that is recorded does not have the strength of each team when the event occured, nor who was on the ice at the time of the event. Making any attempt to calculate meaningful advanced stats like CORSI or FENWICK impossible. Others have gone to the trouble of documenting these APIs, which you can learn about here: https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md I have made an attempt at unifying several of the underlying APIs into a resulting data set that is much richer, and hopefully useful to someone.

# Features

- Every game event is cross-referenced with shift data to determine the strength of play and who was on the ice and at the time it occured
- Many events have been broken up into several different types. For instance, the NHL provides a single goal event when a goal is scored. Instead of the NHL's single goal event, there are now 12 distinct events recorded corresponding to each player/goalie on the ice. A goal event, 0 or more assist events, on ice goal for events for the remaing players, on ice goal against
- The time period an event occured has been unified into a single integer value

# Installation

```
$ npm install nhl-api-crawler
```

# Usage

crawlGames

```typescript
import { crawlGames } from "nhl-api-crawler";

const gameData = await crawlGames("2018-12-05", "2018-12-06");

console.log(gameData);
```

### sample result:

```json
[
      {
        "gamePk": 2018020426,
        "gameType": "R",
        "idx": 114,
        "timestamp": "2018-12-06T02:08:00.000Z",
        "playTime": 1444,
        "type": "GOAL",
        "playerId": 8476454,
        "playerType": "C",
        "playerHandedness": "L",
        "isHome": false,
        "teamId": 22,
        "opposingTeamId": 19,
        "teamScore": 1,
        "opposingTeamScore": 2,
        "teamStrength": 5,
        "opposingStrength": 5,
        "players": [
          8471729,
          8476454,
          8476915,
          8477498,
          8479344,
          8475660
        ],
        "opposingPlayers": [
          8475158,
          8476441,
          8476892,
          8477482,
          8480023,
          8474596
        ],
        "zone": "DEFENSIVE",
        "x": 78,
        "y": 3,
        "secondaryType": "Wrist Shot"
      },
      ...
]
```
