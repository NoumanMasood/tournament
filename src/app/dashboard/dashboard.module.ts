import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule,
        MaterialModule
    ],
    declarations: [
          DashboardComponent,
          TournamentListComponent,
          TournamentEditComponent, 
          TournamentDetailComponent,
          MatchDetailComponent,
          UserDetailComponent,
          FieldErrorDisplayComponent]
})

export class DashboardModule {}
