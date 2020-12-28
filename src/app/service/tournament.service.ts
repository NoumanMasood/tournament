import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  items: any;
  constructor(
    private firestore: AngularFirestore, private http: HttpClient
  ) { 
    this.items = this.firestore.collection('tournament').snapshotChanges();
   }

   getTournaments(): any {
    return this.firestore.collection('tournament').snapshotChanges();
   }
   getMatches(tournamentId: any): any {
    return this.firestore.collection('tournament').doc(tournamentId).collection('matches').snapshotChanges();
   }
   getItems() {
     return this.items;
   }
   getUser(id: any) {
    return this.firestore.collection('users').doc(id).snapshotChanges();
   }
   winner(tournamentId, id, data) {
    return this.firestore.collection('tournament').doc(tournamentId).collection('matches').doc(id).update(data);
   }
   winUser(id, data) {
    return this.firestore.collection('users').doc(id).update(data);
   }

   createMatch(tournamentId, tournament) {
    return this.firestore.collection('tournament').doc(tournamentId).collection('matches').add(tournament);
   }

   getUserMatches(id: any) {
    return this.firestore.collection('userMatches', ref => ref.where('matchId', '==', id)).valueChanges();
   }

   addUserMatches(userId, matchId) {
     const details = {
       userId,
       matchId
     }
    return this.firestore.collection('userMatches').add(details);
   }

  addTournament(tournament: any) {
    return this.firestore.collection('tournament').add(tournament);
  }
   addChampion(tournament: any) {
    return this.firestore.collection('champions').add(tournament);
  }
  postMessages(body: any) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: 'key=AAAABbsSsnA:APA91bHLNzBLOraHZkQ4xo_mEBNUvJ9ScIeyJuljQ4FXcDWTYnCAP1MKbGzjlrTkpdomAakzTVllgc-55um7gmdmxwqJ1HVk6qclolmuUs9_7zHqClJbd0d83XpLSQ61-F87lBNjRSqg'
  });
    return this.http.post('https://fcm.googleapis.com/fcm/send', body, { headers: httpHeaders });
  }
  deleteTournament(id) {
    return this.firestore
        .collection("tournament")
        .doc(id)
        .delete();
 }
 editTournament(id, tournament) {
  return this.firestore.collection('tournament').doc(id).update(tournament);
 }
 getSingleTournament(id) {
  return this.firestore.collection(`tournament`).doc(id).snapshotChanges();
 }
 getSingleMatch(tournamentId, id) {
  return this.firestore.collection('tournament').doc(tournamentId).collection('matches').doc(id).snapshotChanges()
 }
}
