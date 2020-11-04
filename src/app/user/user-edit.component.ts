import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { MessagingService } from '../service/messaging.service';
declare const $: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  users: any[] = [];
  formUser: FormGroup;
  id;
  singleItem;
  item;
  title = 'push-notification';
  message;
  constructor(private userService: UserService, private storage: AngularFireStorage, public route: ActivatedRoute,
     private messagingService: MessagingService) {
   }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
    this.formUser = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      psnName: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
  })
  this.userService.getUsers().subscribe((res) => {
    this.item = res.map((arr) => {
      return {
        id: arr.payload.doc.id,
        ...arr.payload.doc.data()
      }
    })
    this.singleItem = this.item.find((row) => {
      return row.id == this.id;
    })
    this.formUser.patchValue({
      firstName: this.singleItem.firstName,
      lastName: this.singleItem.lastName,
      psnName: this.singleItem.psnName,
      phoneNumber: this.singleItem.phoneNumber,
      email: this.singleItem.email,
      password: this.singleItem.password,
    })
    console.log(res);
  })
}

  onSubmit() {
    this.userService.editUser(this.singleItem.id, this.formUser.value).then(res => {
      console.log(res);
    })
  }
}
