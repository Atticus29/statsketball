import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Team } from '../team.model';
import { Player } from '../player.model';
import { Game } from '../game.model';
import { DbService } from '../db.service';
import { AuthenticateService } from '../authenticate.service';
import { MaterializeAction } from 'angular2-materialize';

import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  teamId: string;
  team: Team;
  players;
  games;
  newPlayerForm: FormGroup;
  positions: any[];
  user: any = null;
  userAssociatedWithTeam: any = null;
  editing: boolean = false;
  showPlayerForm: boolean = false;


  newGameModal = new EventEmitter<string|MaterializeAction>();

  constructor(private route: ActivatedRoute,
              private db: DbService,
              private fb: FormBuilder,
              private authService: AuthenticateService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'];
      this.db.getTeamById(this.teamId)
        .takeUntil(this.ngUnsubscribe).subscribe(team => this.team = team);
      this.db.getPlayersOnTeam(this.teamId)
        .takeUntil(this.ngUnsubscribe).subscribe(players => this.players = players);
      this.db.getGamesPlayedByTeam(this.teamId)
      .takeUntil(this.ngUnsubscribe).subscribe(games => this.games = games);
      this.authService.getCurrentUser()
      .takeUntil(this.ngUnsubscribe).subscribe(userInfo => {
        this.user = userInfo});
      this.db.getUserIdAssociatedWithTeam(this.teamId)
      .takeUntil(this.ngUnsubscribe).subscribe(userId =>{
          this.db.getUserById(Object.keys(userId)[0]).takeUntil(this.ngUnsubscribe).subscribe(userInfo => this.userAssociatedWithTeam = userInfo);
      });
    });
    this.newPlayerForm = this.fb.group({
      playersF: this.fb.array([]),
    });
    this.positions = this.db.getPositions();
    this.addPlayer();
  }

  get playersF(): FormArray {
    return this.newPlayerForm.get('playersF') as FormArray;
  }

  addPlayer() {
    this.playersF.push(this.fb.group({
      name: [''],
      position: [''],
      height: [''],
      weight: [''],
      birthdate: [''],
      jerseyNumber: [''],
      imageURL: ['']
    }))
  }

  removePlayer(index: number) {
    this.playersF.removeAt(index);
    if (this.playersF.length===0) {
      this.togglePlayerForm();
      this.addPlayer();
    }
  }

  savePlayers(){
    var {playersF} = this.newPlayerForm.value;
    this.db.addPlayersToTeam(playersF, this.teamId);
    this.authService.getCurrentUser()
      .takeUntil(this.ngUnsubscribe).subscribe(user=> this.user = user);
    this.newPlayerForm.reset();
    for (var i=0; i<playersF.length; i++) {
      this.removePlayer(0);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openModal() {
    if (this.players.length<5) {
      alert("You need at least 5 players to play a game!");
    } else {
      this.newGameModal.emit({action:"modal",params:['open']});
    }
  }
  closeModal() {
    this.newGameModal.emit({action:"modal",params:['close']});
  }

  clickEdit() {
    this.editing = !this.editing;
  }

  finishEdit() {
    this.editing = false;
  }

  deleteTeam() {
    if (confirm("Are you sure you want to delete this team and all of its players and games?")) {
      this.db.deleteTeam(this.team);
      this.router.navigate(['']);
    }
  }

  togglePlayerForm() {
    this.showPlayerForm = !this.showPlayerForm;
  }

}
