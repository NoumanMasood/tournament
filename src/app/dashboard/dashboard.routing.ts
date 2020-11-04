import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

export const DashboardRoutes: Routes = [
  {

    path: '',
    children: [{
      path: 'dashboard',
      component: DashboardComponent
    }, {
      path: 'tournament-list',
      component: TournamentListComponent
    }, {
      path: 'tournament-edit/:id',
      component: TournamentEditComponent
    }, {
      path: 'tournament-detail/:id',
      component: TournamentDetailComponent
    }, {
      path: 'match-detail/:id',
      component: MatchDetailComponent
    }, {
      path: 'user-detail/:id',
      component: UserDetailComponent
    }]
  }
];
