# nhl-api-crawler

This package provides simple async functions for crawling and enriching the NHL's public APIs into a useful format for aggregation.

# Motivation

The NHL exposes public, undocumented APIs that can be consumed by anyone. Sadly, the data these APIs expose is incredibly convoluted and inadequate for any meaningful aggregations (E.g advanced stats). For example, each event that is recorded does not have the strength of each team when the event occured, nor who was on the ice at the time of the event. Making any attempt to calculate stats like CORSI or FENWICK impossible. Others have gone to the trouble of documenting these APIs, which you can learn about here: https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md I have made an attempt at unifying several of the underlying APIs into a resulting data set that is much richer and easier for aggregations

# Features

- Event data
- Shift data
- Game result data
- Player profile data
- Team profile data

# Notable

- Every game event is cross-referenced with shift data to determine the strength of play and who was on the ice and at the time it occured
- Many events have been broken up into several different types. Every player on the ice for one of the NHL's original events now has its own corresponding event. For instance, the NHL provides a single goal event when a goal is scored. Instead of the NHL's single goal event, there are now distinct events recorded corresponding to each player/goalie on the ice. E.g. A goal event, multiple assist events, on ice goal for events, on ice goal against events, etc.
- Shift data returned by NHL apis is further broken up based on strength of play. If the strength of play changed in the middle of a recored shift, that would now be considered two different shifts corresponding to the two different strengths
- The time period an event occured has been unified into a single integer value corresponding to the seconds elapsed since the start of the game. E.g. an event occuring at playtime 1230 would have happened 30 seconds into the second period
- The zone has been determined based on which team is home/away and which period it currently is

# Installation

```
$ npm install nhl-api-crawler
```

# Usage

## Events

find all event data for all games played between the two date ranges. A unified array containing all events found is returned.

```typescript
import { crawlEvents } from 'nhl-api-crawler'

const events = await crawlEvents('2018-12-05', '2018-12-06')

console.log(events)
```

### Sample result:

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

### Schema

```
[
  {
    "gamePk": number; // unique id provided by nhl apis
    "gameType": "R" | "P" | "A" | "PR"; // indicating regular, playoff, allstar or pre-season
    "idx": number; // the underlying event idx provided by the nhl apis
    "timestamp": iso8601 string; // the underyling event timestamp provided by the nhl apis in iso8601 format
    "playTime": number; // an integer value representing the seconds elapsed since the start of the game; starting at 0
    "type": string; // The type of event occuring. See below for full list of event types
    "playerId": number; // unique id provided by nhl apis
    "playerType": "C" | "RW" | "LW" | "D" | "G";
    "playerHandedness": "L" | "R";
    "isHome": boolean;
    "teamId": number; // unique id provided by nhl apis
    "opposingTeamId": number;  // unique id provided by nhl apis
    "teamScore": number; // score when event occured
    "opposingTeamScore": number; // score when event occured
    "teamStrength": number; // strength of play when event occured
    "opposingStrength": number; // strength of play when event occured
    "players": number[]; // ids of teammates on ice when event occured
    "opposingPlayers": number[]; // ids of opposing players on ice when event occured
    "zone": "DEFENSIVE" | "OFFENSIVE" | "NEUTRAL";
    "x": number; // x coordinate on ice where event occured
    "y": number; // y coordinate on ice  where event occured
    "secondaryType": string; // additional info about event
  },
  ...
]
```

### Event Types:

```
HIT
ON_ICE_HIT
HIT_AGAINST
ON_ICE_HIT_AGAINST,
BLOCKED_SHOT
ON_ICE_BLOCKED_SHOT
SHOT_BLOCKED
ON_ICE_SHOT_BLOCKED
SHOT_MISSED
ON_ICE_SHOT_MISSED
ON_ICE_MISSED_SHOT
SHOT
ON_ICE_SHOT
SAVE
ON_ICE_SAVE
FACEOFF_WIN
ON_ICE_FACEOFF_WIN
FACEOFF_LOSS
ON_ICE_FACEOFF_LOSS
PENALTY_AGAINST
ON_ICE_PENALTY_AGAINST
PENALTY_FOR
ON_ICE_PENALTY_FOR
GOAL
ASSIST
ON_ICE_GOAL
GOAL_ALLOWED
ON_ICE_GOAL_ALLOWED
TAKEAWAY
ON_ICE_TAKEAWAY
GIVEAWAY
ON_ICE_GIVEAWAY
ON_ICE_OFFSIDE
ON_ICE_ICING
ON_ICE_PUCK_OUT_OF_PLAY
SHOOTOUT_GOAL
SHOOTOUT_GOAL_ALLOWED
SHOOTOUT_SHOT
SHOOTOUT_SAVE
SHOOTOUT_MISS
SHOOTOUT_ON_ICE_MISS
```

## Shifts

find all shift data for all games played between the two date ranges. A unified array containing all shift found is returned.

```typescript
import { crawlShifts } from 'nhl-api-crawler'

const shifts = await crawlShifts('2018-12-05', '2018-12-06')

console.log(shifts)
```

### Sample result:

```json
[
  {
    "gamePk": 2018020431,
    "gameType": "R",
    "timestamp": "2018-12-07T00:00:00.000Z",
    "playerId": 8474715,
    "isHome": false,
    "teamId": 29,
    "opposingTeamId": 4,
    "teamStrength": 5,
    "opposingStrength": 5,
    "teamScore": 2,
    "opposingTeamScore": 1,
    "startTime": 2297,
    "endTime": 2342,
    "length": 45
  },
  ...
]
```

### Schema

```
[
  {
    "gamePk": number;
    "gameType": string;
    "timestamp": iso8601 string;
    "playerId": number;
    "isHome": boolean;
    "teamId": number;
    "opposingTeamId": number;
    "teamStrength": number;
    "opposingStrength": number;
    "teamScore": number;
    "opposingTeamScore": number;
    "startTime": number; // seconds since start of the game when shift begins
    "endTime": number; // seconds since start of the game when shift ends
    "length": number; // end time minus start time
  },
      ...
]
```

## Results

find all result data for all games played between the two date ranges. A unified array containing all result found is returned.

```typescript
import { crawlResults } from 'nhl-api-crawler'

const results = await crawlResults('2018-12-05', '2018-12-06')

console.log(results)
```

### Sample result:

```json
[
  {
    "timestamp": "2018-12-05T00:00:00.000Z",
    "gamePk": 2018020427,
    "isHome": false,
    "teamId": 16,
    "opposingTeamId": 24,
    "teamScore": 2,
    "opposingTeamScore": 4,
    "points": 0,
    "resultType": "LOSS",
    "goalieDecisionId": 8470645,
    "goalieStartId": 8470645
  },
  ...
]
```

### Schema

```
[
  {
    "timestamp": iso8601 string;
    "gamePk": number;
    "isHome": boolean;
    "teamId": number;
    "opposingTeamId": number;
    "teamScore": number;
    "opposingTeamScore": number;
    "points": number;
    "resultType": "WIN" | "LOSS" | "OT_LOSS;
    "goalieDecisionId": number; // the unique id of the goalie who recieved the decision
    "goalieStartId": number; // the unique id of the goalie who recieved the start
  },
  ...
]
```

## Players

find all players between two season ranges.

_Note: This is a time consuming call, as the NHL does not provide a good endpoint for fetching player profiles in bulk_

```typescript
import { crawlPlayers } from 'nhl-api-crawler'

const players = await crawlPlayers('20182019', '20182019')

console.log(players)
```

### Sample result:

```json
[
  {
    "id": 8478444,
    "fullName": "Brock Boeser",
    "firstName": "Brock",
    "lastName": "Boeser",
    "primaryNumber": 6,
    "birthDate": "1997-02-25",
    "currentAge": 23,
    "birthCity": "Burnsville",
    "birthCountry": "USA",
    "nationality": "USA",
    "height": "6' 1\"",
    "weight": 208,
    "active": true,
    "alternateCaptain": false,
    "captain": false,
    "rookie": false,
    "shootsCatches": "R",
    "rosterStatus": "Y",
    "primaryPosition": "Forward",
    "currentTeamId": 23
  },
  ...
]
```

### Schema

```
[
  {
    "id": number,
    "fullName": string,
    "firstName": string,
    "lastName": string,
    "primaryNumber": number,
    "birthDate": string,
    "currentAge": number,
    "birthCity": string,
    "birthCountry": string,
    "nationality": string,
    "height": string,
    "weight": number,
    "active": boolean,
    "alternateCaptain": boolean,
    "captain": boolean,
    "rookie": boolean,
    "shootsCatches": string,
    "rosterStatus": string,
    "primaryPosition": string,
    "currentTeamId": number
  },
  ...
]
```

## Teams

find all teams.

```typescript
import { crawlTeams } from 'nhl-api-crawler'

const teams = await crawlTeams()

console.log(teams)
```

### Sample result:

```json
[
  {
    "id": 23,
    "name": "Vancouver Canucks",
    "venue": "Rogers Arena",
    "city": "Vancouver",
    "abbreviation": "VAN",
    "teamName": "Canucks",
    "locationName": "Vancouver",
    "division": "Scotia North",
    "divisionId": 28,
    "conference": "Western",
    "conferenceId": 5
  },
  ...
]
```

### Schema

```
[
  {
    "id": number,
    "name": string,
    "venue": string,
    "city": string,
    "abbreviation": string,
    "teamName": string,
    "locationName": string,
    "division": string,
    "divisionId": number,
    "conference": string,
    "conferenceId": number
  },
  ...
]
```
