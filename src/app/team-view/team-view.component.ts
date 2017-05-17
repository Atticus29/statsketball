import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Team } from '../team.model';
import { Player } from '../player.model';
import { Game } from '../game.model';
import { DbService } from '../db.service';
import { MaterializeAction } from 'angular2-materialize';

import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

import { AuthenticateService } from '../authenticate.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.css']
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
  editing: boolean = false;

  newGameModal = new EventEmitter<string|MaterializeAction>();

  constructor(private route: ActivatedRoute,
              private db: DbService,
              private fb: FormBuilder,
              private authService: AuthenticateService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'];
      this.db.getTeamById(this.teamId)
        .takeUntil(this.ngUnsubscribe).subscribe(team => this.team = team);
      this.db.getPlayersOnTeam(this.teamId)
        .takeUntil(this.ngUnsubscribe).subscribe(players => this.players = players);
      this.db.getGamesPlayedByTeam(this.teamId)
      .takeUntil(this.ngUnsubscribe).subscribe(games => this.games = games);
    });
    this.newPlayerForm = this.fb.group({
      playersF: this.fb.array([]),
    });
    this.positions = this.db.getPositions();
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
      jerseyNumber: ['']
    }))
  }

  removePlayer(index: number) {
    this.playersF.removeAt(index);
  }

  savePlayers(){
    var {playersF} = this.newPlayerForm.value;
    this.db.addPlayersToTeam(playersF, this.teamId);
    this.authService.getCurrentUser()
      .takeUntil(this.ngUnsubscribe).subscribe(user=> this.user = user);
    this.newPlayerForm.reset();
    for (var i=0; i<playersF.length; i++) {
      this.removePlayer(i);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openModal() {
    this.newGameModal.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.newGameModal.emit({action:"modal",params:['close']});
  }

  clickEdit() {
    this.editing = true;
  }

  finishEdit() {
    this.editing = false;
  }

}
