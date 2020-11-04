import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { UserAddComponent } from './user-add.component';
import { UserListComponent } from './user-list.component';
import { UserEditComponent } from './user-edit.component';
import { UserRoutes } from './user.routing';
import { UserNotificationComponent } from './user-notification.component';
import { ChatComponent } from './chat.component';
import { UserTourDetailComponent } from './user-tour-detail.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule,
        MdModule,
        MaterialModule
    ],
    declarations: [UserAddComponent, UserListComponent, UserEditComponent, UserNotificationComponent, ChatComponent, UserTourDetailComponent]
})

export class UserModule {}
