import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TournamentService } from '../../service/tournament.service';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/service/user.service';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  tournaments: any[] = [];
  item;
  formTournament: FormGroup;
  downloadURL: Observable<string>;
  fb;
  banner;
  userId;
  singleItem;
  matches;
  match;
  tournamentId;
  user;
  userMatches;
  users;
  userData;
  constructor(private tournamentService: TournamentService,
    private userService: UserService,
    private storage: AngularFireStorage,
    public route: ActivatedRoute,
    public firestore: AngularFirestore) {
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params.id;
    });
  
      this.tournamentService.getUser(this.userId).subscribe((res: any) => {
        this.user = {
          id: res.payload.id,
          ...res.payload.data()
        };
      });
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
