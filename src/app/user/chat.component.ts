import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../service/tournament.service';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chat') private myScrollContainer: ElementRef;
  messagesCollection: any;
  messages: Observable<any[]>;
  message: any;
  id: any;
  messageName: any;
  user: any;

  constructor(public afs: AngularFirestore, public route: ActivatedRoute, public tournamentService: TournamentService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.tournamentService.getUser(this.id).subscribe((res: any) => {
        this.user = {
          id: res.payload.id,
          ...res.payload.data()
        };
      });
    });
    this.getChatData();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}

  getChatData() {
    this.messagesCollection = this.afs.collection<any>('adminMessages').doc(this.id).collection('messages').valueChanges();
    this.messagesCollection.subscribe((res) => {
      console.log(res);
      this.messages = res.sort((a, b) => a.timeStamp - b.timeStamp);
      
      console.log(this.messages);
    });

    this.messages.subscribe((res) => {
      // res.sort(function(a,b){

      //   return new Date(b.timeStamp) - new Date(a.timeStamp);
      // });
      this.message = res;
      console.log(res);
    });
  }

  newMessage(messageBody) {
    const date = Date.now();
    const message: any = {
      messageBody,
      senderType: 'admin',
      timeStamp: date
    }
    this.afs.collection<any>('adminMessages').doc(this.id).collection('messages').add(message);
    this.messageName = '';
    
  }
}
