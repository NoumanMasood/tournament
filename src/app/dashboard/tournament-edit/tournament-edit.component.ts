import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TournamentService } from '../../service/tournament.service';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './tournament-edit.component.html'
})
export class TournamentEditComponent implements OnInit {
  tournaments: any[] = [];
  item;
  formTournament: FormGroup;
  downloadURL: Observable<string>;
  fb;
  banner;
  id;
  singleItem;
  constructor(private tournamentService: TournamentService,private storage: AngularFireStorage, public route: ActivatedRoute) {
   }

  players = [
    {value: '0', viewValue: '0'},
    {value: '1', viewValue: '1'},
    {value: '2', viewValue: '2'},
    {value: '3', viewValue: '3'},
    {value: '4', viewValue: '4'},
    {value: '5', viewValue: '5'},
    {value: '6', viewValue: '6'},
  ];

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
    this.formTournament = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      entryFee: new FormControl(''), 
      startDate: new FormControl(''),
      prizeMoney: new FormControl(''),
      numberOfPlayer: new FormControl(''),
      banner: new FormControl(''),
  })
    this.tournamentService.getTournaments().subscribe((res) => {
     
      this.item = res.map((arr) => {
        return {
          id: arr.payload.doc.id,
          ...arr.payload.doc.data()
        }
      })
      this.singleItem = this.item.find((row) => {
        return row.id = this.id;
      })
      this.formTournament.patchValue({
        name: this.singleItem.name,
        description: this.singleItem.description,
        entryFee: this.singleItem.entryFee, 
        startDate: this.singleItem.startDate,
        prizeMoney: this.singleItem.prizeMoney,
        numberOfPlayer: this.singleItem.numberOfPlayer,
        banner: this.singleItem.banner,
      })
      console.log(res);
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
