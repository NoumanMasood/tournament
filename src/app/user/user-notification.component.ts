import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { UserService } from '../service/user.service';
import { MessagingService } from '../service/messaging.service';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../service/tournament.service';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './user-notification.component.html'
})
export class UserNotificationComponent implements OnInit {
  
  users: any[] = [];
  formUser1: FormGroup;
  title = 'push-notification';
  message;
  id;
  userMatches: any[] = [];
  userData;
  tokenArray: any[] = [];
  userWithTokenArray: any[] = [];
  userId;
  singleUser;
  constructor(public route: ActivatedRoute, private userService: UserService, private storage: AngularFireStorage,
    private messagingService: MessagingService,private tournamentService: TournamentService) {
   }

  public ngOnInit() {
    this.formUser1 = new FormGroup({
      title: new FormControl(''),
      body: new FormControl(''),
  })
    this.route.queryParams.subscribe((params) => {
      this.userId = params.userId;
    });
    if(this.userId) {

    this.userService.getSingleUser(this.userId).subscribe((users: any) => {
         this.singleUser = {
          id: users.payload.id,
          ...users.payload.data()
        }

    })
    
  }
    this.users = this.userService.getUsers().subscribe((users: any) => {
      this.users = users.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      })

      this.users.map((data: any) => {
        if(data.deviceToken) {
          this.tokenArray.push(data.deviceToken);
          this.userWithTokenArray.push(data.id);
        }
      })
      console.log(this.tokenArray, '----------');
    })
    
  }

  onSubmit() {
    this.tokenArray.map((token, i) => {
      this.messagingService.requestPermission(this.userWithTokenArray[i], this.formUser1.value);
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      const payload = {
        notification: {
          title: this.formUser1.value.title,
          body: this.formUser1.value.body
        },
        data: {
          type: "refresh_data"
       },
        to: token
      }
      this.tournamentService.postMessages(payload).subscribe((res) => {
        console.log(res, 'llllllllllll');
      });
      this.messagingService.updateToken(this.userWithTokenArray[i], token);
    },
  (err) => {
    console.error('Unable to get permission to notify.', err);
  }
  )
    // admin.database().ref(`fcmTokens/${this.id}`).once('value').then(token => token.val()).then(userFcm => {
    //   return admin.messaging().sendToDevice(userFcm, payload);
    // })
    this.userService.addMessage(this.formUser1.value).then(res => {
      console.log(res);
    })
  }
}
