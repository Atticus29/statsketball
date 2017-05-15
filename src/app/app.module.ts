import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { NewTeamComponent } from './new-team/new-team.component';
import { NewPlayerComponent } from './new-player/new-player.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { NewGameComponent } from './new-game/new-game.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { TeamViewComponent } from './team-view/team-view.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { GameViewComponent } from './game-view/game-view.component';
import { UpdateStatsComponent } from './update-stats/update-stats.component';
import { CalculateStatsPipe } from './calculate-stats.pipe';
import { SeasonFilterPipe } from './season-filter.pipe';
import { TeamListComponent } from './team-list/team-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NewTeamComponent,
    NewPlayerComponent,
    EditPlayerComponent,
    EditTeamComponent,
    NewGameComponent,
    EditGameComponent,
    TeamViewComponent,
    PlayerViewComponent,
    GameViewComponent,
    UpdateStatsComponent,
    CalculateStatsPipe,
    SeasonFilterPipe,
    TeamListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    MaterializeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
