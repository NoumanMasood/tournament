import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

declare var $: any;
declare interface TableData {
  headerRow: string[];
}
declare interface TableWithCheckboxes {
    id?: number;
    ischecked?: boolean;
    product_name: string;
    type: string;
    quantity: number;
    price: any;
    amount: string;
}
export interface TableData2 {
  headerRow: string[];
  dataRows: TableWithCheckboxes[];
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData2;
  public tableData3: TableData;
  userList: any = [];
  item;
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.tableData1 = {
          headerRow: [ 'First Name', 'Last Name', 'PSN Name', 'Phone Number', 'PSN Number',
           'Email', 'Password', ''],
          // dataRows: this.tournamentList
       };
    this.userService.getUsers().subscribe((res) => {
      this.item = res.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      })
      console.log(res);
    })
  }

  block(id) {
    this.userService.editUser(id, {isBlock: true});
  }
 
  deleteUser(id) {
    this.userService.deleteUser(id);
 }
}
