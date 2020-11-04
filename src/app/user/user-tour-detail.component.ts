import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../service/tournament.service';
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
export class UserTourDetailComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData2;
  public tableData3: TableData;
  tournamentCollection;
  userList: any = [];
  item;
  userId;
  tournamentsArray: any[] = [];
  tournaments;
  constructor(public route: ActivatedRoute,public afs: AngularFirestore, private userService: UserService,private tournamentService: TournamentService) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params.id;
    });
    this.tableData1 = {
          headerRow: [ 'Tournament Name', 'Entry Fee', 'Prize Money', 'Start Date', 'Number of Players',
           ],
          // dataRows: this.tournamentList
       };
       this.tournamentService.getTournaments().subscribe((res) => {
         console.log(res, 'ssssssssss');
        this.tournaments = res.map((arr) => {
          return {
            id: arr.payload.doc.id,
            ...arr.payload.doc.data()
          }
        });
        console.log(this.tournaments, 'jjjjjjjjjjjj')
      })

      //  this.userService.getSingleUser(this.userId).subscribe((users: any) => {
      //   this.item = {
      //    id: users.payload.id,
      //    ...users.payload.data()
      //  }

      //  this.item.tournaments.map((id) => {
      //    this.tournamentService.getSingleTournament(id).subscribe((tournament: any) => {
         
      //     this.tournamentsArray.push( {
      //       id: tournament.payload.id,
      //       ...tournament.payload.data()
      //     })
      //     console.log(this.tournamentsArray, 'pppppppppppppp')
      //   })
      //  })

      // this.item.tournaments.map((id) => {
      //   this.tournamentCollection = this.afs.collection<any>('tournament').doc(id).valueChanges();
      //   this.tournamentCollection.subscribe((tour) => {
      //     console.log(tour, 'iii');          
      //   })
      // })
      
  //  })
    // this.userService.getUsers().subscribe((res) => {
    //   this.item = res.map((arr) => {
    //     return {
    //       id: arr.payload.doc.id,
    //       ...arr.payload.doc.data()
    //     }
    //   })
    //   console.log(res);
    // })
  }

}
