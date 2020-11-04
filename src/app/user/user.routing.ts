import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';

import { UserAddComponent } from './user-add.component';
import { UserEditComponent } from './user-edit.component';
import { UserListComponent } from './user-list.component';
import { UserNotificationComponent } from './user-notification.component';
import { UserTourDetailComponent } from './user-tour-detail.component';

export const UserRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'user-add',
        component: UserAddComponent
    },{
      path: 'user-list',
      component: UserListComponent
  },{
    path: 'user-edit/:id',
    component: UserEditComponent
},{
  path: 'user-notification',
  component: UserNotificationComponent
},{
  path: 'chat/:id',
  component: ChatComponent
},{
  path: 'user-tour-detail/:id',
  component: UserTourDetailComponent
}]
}
];
