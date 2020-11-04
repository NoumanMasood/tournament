import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { UserService } from '../service/user.service';
import { MessagingService } from '../service/messaging.service';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './user-add.component.html'
})
export class UserAddComponent implements OnInit {
  users: any[] = [];
  formUser: FormGroup;
 
  constructor(private userService: UserService, private storage: AngularFireStorage) {
   }

  public ngOnInit() {
   
    this.userService.getItems().subscribe(res => {
      console.log(res);
    });
    this.formUser = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      psnName: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
  })
  }

  onSubmit() {
    this.userService.addUser(this.formUser.value).then(res => {
      console.log(res);
    })
  }
}
