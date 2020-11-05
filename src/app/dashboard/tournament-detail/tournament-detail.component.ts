import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TournamentService } from '../../service/tournament.service';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/service/user.service';
import { MessagingService } from 'src/app/service/messaging.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.scss']
})
export class TournamentDetailComponent implements OnInit {
  tournaments: any[] = [];
  item;
  formTournament: FormGroup;
  downloadURL: Observable<string>;
  fb;
  banner;
  id;
  singleItem;
  matches;
  match;
  users;
  userMatches: any[] = [];
  userData : any[] = [];
  matchId;
  pendingMatches;
  completeMatches;
  message;
  tokenArray: any[] = [];
  userWithTokenArray: any[] = [];
  formMessageUser: FormGroup;
  tableData1;
  title;
  body;
  constructor(private tournamentService: TournamentService, private userService: UserService,
    private storage: AngularFireStorage,private messagingService: MessagingService,
     public route: ActivatedRoute,
     public firestore: AngularFirestore,
     public dialog: MatDialog) {
   }

  public ngOnInit() {
    this.formMessageUser = new FormGroup({
      title: new FormControl(''),
      body: new FormControl(''),
  })
  this.tableData1 = {
    headerRow: [ 'First Name', 'Last Name', 'PSN Name', 'Phone Number',
     'Email', ''],
    // dataRows: this.tournamentList
 };
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
    this.matches = this.tournamentService.getMatches(this.id).subscribe((match) => {

      this.match = match.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      });
      this.pendingMatches = this.match.filter((match: any) => {
        return match.status == 'pending';
      })
      this.completeMatches = this.match.filter((match: any) => {
        return match.status == 'completed';
      })
      this.match.map((mat: any) => {

      this.tournamentService.getUserMatches(mat.id).subscribe((res) => {
        res.length > 0 && this.userMatches.push(res);
        this.users = this.userService.getUsers().subscribe((users: any) => {
          this.users = users.map((arr) => {
            return {
              id: arr.payload.doc.id,
              ...arr.payload.doc.data()
            }
          })
          this.users.map((user: any) => {
            return this.userMatches.length > 0 && this.userMatches.map((userMatch: any) => {
              return userMatch.map((userMat: any) => {
 
                if( user.id == userMat.userId) { 
                  this.userData.push({ match: mat, ...user});
                }
              })
            })
          })

          this.userData.map((data: any) => {
            if(data.deviceToken) {
              this.tokenArray.push(data.deviceToken);
              this.userWithTokenArray.push(data.id);
            }
          })
          console.log(this.tokenArray, '----------');
        })
      });
    })
    })
    this.tournamentService.getTournaments().subscribe((res) => {
      this.item = res.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      })
      this.singleItem = this.item.find((row) => {
        return row.id === this.id;
      })
    console.log(this.matches);
    });

  }

  sendNotification() {
    this.tokenArray.map((token, i) => {

      this.messagingService.requestPermission(this.userWithTokenArray[i], this.formMessageUser.value);
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      const payload = {
        notification: {
          title: this.formMessageUser.value.title,
          body: this.formMessageUser.value.body
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
  }
  getUser(id: any) {
    return this.userData && this.userData.filter((user) => {
      return user.id == id;
    })
  }
  onFileSelected(event) {
    const n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }
  onSubmit() {
    console.log(this.formTournament.value);
    this.formTournament.value.banner = 'https://firebasestorage.googleapis.com/v0/b/tournament-62907.appspot.com/o/RoomsImages%2F1601405964819?alt=media&token=c903c131-4493-4daa-a7c7-ee54a35b6196';

    this.tournamentService.editTournament(this.singleItem.id, this.formTournament.value).then(res => {
      console.log(res);
    })
  }
}
