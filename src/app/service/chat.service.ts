import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit {
  constructor(private db: AngularFirestore, private http: HttpClient) { }

  ngOnInit() { }

  getMessagesList() {
    return this.db.collection('Chat').valueChanges();
  }

  getMessages(user) {
    return this.db
      .collection('Chat/' + user + '/messages', ref => {
        return ref.orderBy('timeStamp');
      })
      .valueChanges();
  }

  getMessagesId(userID) {
    return this.db.collection('Chat/' + userID + '/messages').valueChanges();
  }

  getUsersList(firebaseIds) {
    // return this.http.post('/users/search', { firebaseIds });
  }

  sendMessage(user, message, chatID) {
    const messageData = {
      senderID: user.id,
      messageBody: message,
      senderName: user.name,
      timeStamp: new Date().getTime()
    };
    const agentMeta = {
      name: user.name,
      new: true
    };
    const userMeta = {
      new: false
    };

    this.db.collection(`Chat/${chatID}/messages`).add(messageData);
    // this.db.database.ref(`Chat/${chatID}/meta-data/agent`).update(agentMeta);
    // this.db.database.ref(`Chat/${chatID}/meta-data/user`).update(userMeta);
  }

  endConversation(chatID) {
    const agentMeta = {
      name: '',
      new: false
    };
    const userMeta = {
      new: false
    };
    // this.db.database.ref(`Chat/${chatID}/meta-data/agent`).update(agentMeta);
    // this.db.database.ref(`Chat/${chatID}/meta-data/user`).update(userMeta);
  }
}