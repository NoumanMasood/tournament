import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  items: any;
  constructor(
    private firestore: AngularFirestore
  ) { 
    this.items = this.firestore.collection('users').snapshotChanges();
   }

   getUsers(): any {
    return this.firestore.collection('users').snapshotChanges();
   }
   getItems() {
     return this.items;
   }
   addMessage(user: any) {
    return this.firestore.collection('messages').add(user);
   }
  addUser(user: any) {
    return this.firestore.collection('users').add(user);
  }
  deleteUser(id) {
    return this.firestore
        .collection("users")
        .doc(id)
        .delete();
 }
 editUser(id, user) {
  return this.firestore.collection('users').doc(id).update(user);
 }

 getSingleUser(id) {
  return this.firestore.collection(`users`).doc(id).snapshotChanges();
 }
}