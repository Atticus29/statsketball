# Statsketball

## Ryan McAlpin, Janek Brandt, Mark Fisher

## May 15-18, 2017

## Description
A webapp made using the Angular2 javaScript framework that allows users (e.g., a coach of a high school basketball team) to log in via their google accounts and then create teams, players, games, and track statistics for these objects. Statsketball also allows users (even when not logged in) to view other users' teams and statistics (but not edit them).

## Set Up

This app is live at [https://statsketball-27ff5.firebaseapp.com](https://statsketball-27ff5.firebaseapp.com)

## User stories
- [x] As a user, I'd like to create a basketball team
- [x] As a user, I'd like to create a player
- [x] As a user, I'd like to be able to add players to my team (any time of season)
- [x] As a user, I'd like to be able to remove players from my team (any time of season)...retaining their contributing stats, but removing their player ID from team. The player object doesn't actually get deleted.
- [x] As a user, I'd like to delete a player from the system. Go ahead and remove all references to that player ID.
- [x] As a user, I'd like to be able to edit a player profile (e.g., aging, weight gain, etc.)
- [x] As a user, I'd like to be able to add a game to my season. This would entail indicating team ID, opponent.
- [x] As a user, I'd like to be able to add stats to an individual player.
- [x] As soon as a stat gets recorded, adds their Id to the game, +1 to games this season, etc.
- [x] As a user, I'd like to be able to see each player's total attempts and goals, minutes played, position, etc..
- [x] As a user, I'd like to be able to see a game's total attempts and goals, etc., for each game that has already been played for each season.
- [x] As a user, I'd like to be able to click on a particular game and see game-specific stats for all players that participated in that game
- [x] As a user, I'd like to be able to view the roster of a team


## Forms
- [x] new-team
- [x] edit-team
- [x] new-player
- [x] edit-player
- [x] new-game
- [x] edit-game
- [x] update-stats

## Components
- [x] new-team
  - [x] new-player
  - [x] edit-player
- [x] edit-team
- [x] new-game
- [x] edit-game
- [x] team-view
  - [x] player-view
  - [x] game-view
    - [x] update-stats
- [x] team-list

## Routes
- [x] '/teams'
- [x] '/teams/new' (adding and removing players happens here)
- [x] '/teams/:teamId'
- [x] '/teams/:teamId/players/:playerId'
- [x] '/teams/:teamId/games/:gameId/stats'

## Pipes
- [x] breadcrumbs

## Services
- [x] db (addStat, addGame, addPlayer, etc.)
- [x] authenticate (login, logout, etc.)

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

- [x] games
  - [x] id (matching key in gamesPlayed)....?
    - [x] teamId (just yours)
    - [x] opponent {Team obj with no players}
    - [ ] season (standardized; limit input)
    - [x] location
    - [x] date

## Future Directions
- [ ] Implement and track seasons and accompanying statistics
- [ ] Summary tables across seasons for a player
