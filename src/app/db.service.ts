import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Team } from './team.model';
import { Player } from './player.model';

@Injectable()
export class DbService {
  teams: FirebaseListObservable<any>;
  positions: any[] = [
    {short: 'PG', long: 'Point Guard'},
    {short: 'SG', long: 'Shooting Guard'},
    {short: 'SF', long: 'Small Forward'},
    {short: 'PF', long: 'Power Forward'},
    {short: 'C', long: 'Center'}
  ];

  constructor(private db: AngularFireDatabase) {
    this.teams = db.list('/teams');
  }

  getLongPosition(shortPosition: string){
  let result=this.positions.filter(position=>{
  return position.short===shortPosition});
  return result[0].long;
  }

  createTeam(team: Team, players: Player[], currentUserId: string) {
    var teamId = this.teams.push(team).key;

    players.forEach(player => {
      var playerId = firebase.database().ref('/players').push().key;
      var updates = {}
      updates['/teams/'+teamId+'/players/'+playerId] = true;
      updates['/teams/' + teamId + '/user/' + currentUserId] = true;
      updates['/users/' + currentUserId + '/teams/' + teamId] = true;
      updates['/players/'+playerId] = {
        name: player.name,
        position: player.position,
        height: player.height,
        weight: player.weight,
        birthdate: (new Date(player.birthdate).toJSON()),
        jerseyNumber: player.jerseyNumber,
        teamId: teamId
      };
      firebase.database().ref().update(updates);
    })
    return teamId;
  }

    createGame(team: any, game: any) {
    var gameId = firebase.database().ref('/games').push().key;
    var updates = {};
    updates['/games/'+gameId] = game;
    updates['/teams/'+game.teamId+'/games/'+gameId] = true;
    Object.keys(team.players).forEach(player => {
      updates['/singleGamePlayerStats/'+gameId+'/'+player] = {
        minutes: 0,
        twoMade: 0,
        twoAttempt: 0,
        threeMade: 0,
        threeAttempt: 0,
        freeMade: 0,
        freeAttempt: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        turnovers: 0,
        steals: 0,
        blocks: 0,
        fouls: 0
      }
    })
    firebase.database().ref().update(updates);
    return gameId;
  }

  getPositions() {
    return this.positions;
  }

  getTeams(){
    return this.teams;
  }

  getTeamById(teamId: string) {
    return this.db.object('/teams/'+teamId);
  }

  getGameById(gameId: string) {
    return this.db.object('/games/'+gameId);
  }

  getGameByIdOnce(gameId: string) {
    return firebase.database().ref('/games/'+ gameId).once('value');
  }

  getPlayerByIdOnce(playerId: string) {
    return firebase.database().ref('/players/'+ playerId).once('value');
  }

  getTeamByIdOnce(teamId: string) {
    return firebase.database().ref('/teams/'+teamId).once('value');
  }

  getPlayerById(playerId: string){
    return this.db.object('/players/' + playerId);
  }

  getPlayerGameStats(gameId: string, playerId: string) {
    return this.db.object('/singleGamePlayerStats/'+gameId+'/'+playerId);
  }

  getGameStats(gameId: string) {
    return this.db.list('/singleGamePlayerStats/'+gameId).scan((acc, players) => {
      return players.reduce((acc, player) => {
        let total = {};
        Object.keys(player).map(key => total[key] = acc[key] ? acc[key] + player[key] : player[key])
        return total;
      }, {});
    }, []);
  }

  getPlayersOnTeam(teamId: string){
    return this.db.list('teams/' + teamId + '/players').switchMap(players=>{
      return players.length===0 ? Observable.of([]) : Observable.combineLatest(...players.map(player => this.getPlayerById(player.$key)))
    });
  }

  getGamesPlayedByTeam(teamId: string){
    return this.db.list('teams/' + teamId + '/games').switchMap(games=>{
      return games.length===0 ? Observable.of([]) :
      Observable.combineLatest(...games.map(game=>
      this.getGameById(game.$key)))
    });
  }

  getUserIdAssociatedWithTeam(teamId: string){
    return this.db.object('/teams/' + teamId + '/user/');
  }

  getGamesPlayedByPlayer(playerId: string){
    return this.db.list('players/' + playerId + '/gamesPlayed').switchMap(games=>{
      return games.length===0 ? Observable.of([]) :
      Observable.combineLatest(...games.map(game=>
      this.getGameById(game.$key)))
    });
  }

  convertInchesToFeetAndInches(inches: number){
    let whole =Math.floor(inches/12.0).toString()+"\'";
    let remainingInches: string  = '';
    if(inches %12){
      remainingInches = (inches %12).toString()+"\"";
    }
    return {ft:whole, in:remainingInches}
  }

  calculateAge(birthdate: string){
    let parsedDate = this.parseBirthdayString(birthdate);
    return this.getAgeFromMonthDayYear(parsedDate.month, parsedDate.day, parsedDate.year);
  }

  parseBirthdayString(date: string){
    return {month:date.replace(/^\d+-(\d+)-.*/,"$1"),
    day:date.replace(/^\d+-\d+-(\d+)T.*/,"$1"),
    year:date.replace(/(^\d+)-.*/,"$1")};
  }

  getAgeFromMonthDayYear(birthMonth, birthDay, birthYear){
  let todayDate = new Date();
  let todayYear = todayDate.getFullYear();
  let todayMonth = todayDate.getMonth();
  let todayDay = todayDate.getDate();
  let age = todayYear - birthYear;
    if (todayMonth < birthMonth - 1)
    {
      age--;
    }
    if (birthMonth - 1 == todayMonth && todayDay < birthDay)
    {
      age--;
    }
  return age;
  }

  addPlayersToTeam(players: any, teamId: string) {
    players.forEach(player => {
      var playerId = firebase.database().ref('/players').push().key;
      var updates = {};
      updates['/teams/'+teamId+'/players/'+playerId] = true;
      updates['/players/'+playerId] = {
        name: player.name,
        position: player.position,
        height: player.height,
        weight: player.weight,
        birthdate: (new Date(player.birthdate).toJSON()),
        jerseyNumber: player.jerseyNumber,
        teamId: teamId
      };
      firebase.database().ref().update(updates);
    })
  }

  getUserById(userId: string){
    let retrievedUser = this.db.object('users/' + userId);
    return retrievedUser;
  }

  addGameToPlayers(team: any, game: any, gameId:string) {
    var updates = {};
    Object.keys(team.players).forEach(player => {
      updates['/players/'+ player + '/gamesPlayed/'+ gameId] = true;
    })
    firebase.database().ref().update(updates);
    return gameId;
  }

  updateTeam(teamId: string, team: any) {
    this.teams.update(teamId, team);
  }
}
