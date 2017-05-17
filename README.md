# Statsketball

## Ryan McAlpin, Janek Brandt, Mark Fisher

## May 15-18, 2017

## User stories
- [x] As a user, I'd like to create a basketball team
- [x] As a user, I'd like to create a player
- [x] As a user, I'd like to be able to add players to my team (any time of season)
- [ ] As a user, I'd like to be able to remove players from my team (any time of season)...retaining their contributing stats, but removes player ID from team. The player object doesn't actually get deleted.
- [ ] As a user, I'd like to delete a player from the system. Go ahead and remove all references to that player ID.
- [ ] As a user, I'd like to be able to edit a player profile (e.g., aging, weight gain, etc.)


- [x] As a user, I'd like to be able to add a game to my season. This would entail indicating team ID, opponent.
- [x] As a user, I'd like to be able to add stats to an individual player.
- [ ] As soon as a stat gets recorded, adds their Id to the game, +1 to games this season, etc.

- [ ] As a user, I'd like to be able to see each player's total attempts and goals, minutes played, position, etc. for each season.
- [x] As a user, I'd like to be able to see a game's total attempts and goals, etc., for each game that has already been played for each season.
- [x] As a user, I'd like to be able to click on a particular game and see game-specific stats for all players that participated in that game
- [ ] As a user, I'd like to be able to view the roster of a team


## Forms
- [x] new-team
- [ ] edit-team
- [x] new-player
- [ ] edit-player
- [x] new-game
- [ ] edit-game
- [x] update-stats

## Components
- [x] new-team
  - [x] new-player
  - [ ] edit-player
- [ ] edit-team
- [x] new-game
- [ ] edit-game
- [x] team-view
  - [x] player-view
  - [x] game-view
    - [x] update-stats
- [x] team-list

## Routes
- [x] '/teams'
- [x] '/teams/new' (adding and removing players happens here)
- [x] '/teams/:teamId'
- [ ] '/teams/:teamId/edit' (adding and editing players happens here, too)
- [x] '/teams/:teamId/players/:playerId'
- [-] '/teams/:teamId/games/new'
- [x] '/teams/:teamId/games/:gameId/stats'

## Pipes
- [ ] calculateStats
- [ ] seasonFilter
- [x] breadcrumbs

## Services
- [+] db (addStat, addGame, addPlayer, etc.)
- [ ] authenticate (login, logout, etc.)

## Models
- [x] teams
 - [x] teamId (key)
   - [x] name
   - [x] playerIDs: string[] ... firebase {key, true}
   - [x] location
   - [x] coachName

- [x] players
  - [x] id
    - [x] teamId
    - [x] name
    - [x] position
    - [x] height
    - [x] weight
    - [x] birthdate (age calculated; currently timestamp)
    - [x] gamesPlayed ... firebase {key, true--> null when we want to remove}

- [ ] games
  - [x] id (matching key in gamesPlayed)....?
    - [x] teamId (just yours)
    - [x] opponent {Team obj with no players}
    - [ ] season (standardized; limit input)
    - [x] location
    - [x] date
    - [-] playersInGame (keys of players)...don't need because we have teamId

- [ ] singleGamePlayerStats
  - [ ] game id (matching key in game?)
    - [ ] player id (matches player key)
      - [ ] minutesPlayed
      - [ ] 2-pointers attempted
      - [ ] 2-pointers made
      - [ ] 3-pointers attempted
      - [ ] 3-pointers made
      - [ ] field goals attempted (calculated, not stored)
      - [ ] field goals made (calculated, not stored)
    - [ ] player id
      - [ ] minutesPlayed
      - [ ] other stat
      - [ ] other stat

- [ ] seasonPlayerStats
  - [ ] player id
    - [ ] season
      - [ ] minutesPlayed
      - [ ] 2-pointers attempted
      - [ ] 2-pointers made
      - [ ] 3-pointers attempted
      - [ ] 3-pointers made
      - [ ] games played: gameKeys[] (calculate total with length of this array)
    - [ ] season
      - [ ] minutesPlayed
      - [ ] 2-pointers attempted
      - [ ] 2-pointers made
      - [ ] 3-pointers attempted
      - [ ] 3-pointers made
      - [ ] games played: gameKeys[] (calculate total with length of this array)
  - [ ] player id
    - [ ] season
      - [ ] minutesPlayed
      - [ ] 2-pointers attempted
      - [ ] 2-pointers made
      - [ ] 3-pointers attempted
      - [ ] 3-pointers made
      - [ ] games played: gameKeys[] (calculate total with length of this array)



10-15 players w/ ~82 games per season

## Checklist

### Monday
- [x] Form for creating a team -jb
- [ ] Service for, to start, addTeam
- [x] constructor for team model -rm
- [ ] Main page set up (welcome/about page, navbar with breadcrumbs) -mf

- [ ] Update and edit functions have to be mindful of several "tables"
- [ ] As soon as a player plays >0 minutes in a game, add that player id to game object and add game id to the player object.
- [ ] As we add game, retrieve all previous games, re-calculate averages, and update averages table

## Future
- [ ] User authentication (if not logged in, you could view stats, but not edit)
- [ ] Summary tables across seasons for a player
