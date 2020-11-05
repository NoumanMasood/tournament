import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TournamentService } from '../../service/tournament.service';
// import { AngularFireDatabase } from 'angularfire2/database';

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
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData2;
  public tableData3: TableData;
  tournamentList: any = [];
  item;
  constructor(private tournamentService: TournamentService) {}
  ngOnInit() {
    this.tableData1 = {
          headerRow: [ 'Name', 'Description', 'Entry Fee', 'First Prize Money', 'Second Prize Money', 'Third Prize Money', 'Start Date', 'Number Of players', 'Banner', ''],
          // dataRows: this.tournamentList
       };
    this.tournamentService.getTournaments().subscribe((res) => {
      this.item = res.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      })
      console.log(res);
    })
    // this.tournamentService.getItems().subscribe((res) => {
    //   console.log(res);
    //   this.tournamentList = res;
    //   this.tableData1 = {
    //     headerRow: [ 'Name', 'Description', 'Entry Fee', 'Prize Money', 'Start Date', 'Number Of players', 'Banner', ''],
    //     dataRows: this.tournamentList
    //  };
    // });


  }

  deleteTournament(id) {
    this.tournamentService.deleteTournament(id);
 }


  // getTotal() {
  //     let total = 0;
  //     for (let i = 0; i < this.tableData3.dataRows.length; i++) {
  //         const integer = parseInt(this.tableData3.dataRows[i][8], 10);
  //         total += integer;
  //     }
  //     return total;
  // };
}
