import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TournamentService } from '../service/tournament.service';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  tournaments: any[] = [];
  formTournament: FormGroup;
  downloadURL: Observable<string>;
  fb;
  banner;
  error = '';
  imageSrc;
  constructor(private tournamentService: TournamentService,
    private storage: AngularFireStorage,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router) {
   }

  players = [
    {value: '8',  viewValue: '8'},
    {value: '9',  viewValue: '9'},
    {value: '10', viewValue: '10'},
    {value: '11', viewValue: '11'},
    {value: '12', viewValue: '12'},
    {value: '13', viewValue: '13'},
    {value: '14', viewValue: '14'},
    {value: '15', viewValue: '15'},
    {value: '16', viewValue: '16'},
    {value: '17', viewValue: '17'},
    {value: '18', viewValue: '18'},
    {value: '19', viewValue: '19'},
    {value: '20', viewValue: '20'},
    {value: '21', viewValue: '21'},
    {value: '22', viewValue: '22'},
    {value: '23', viewValue: '23'},
    {value: '24', viewValue: '24'},
    {value: '25', viewValue: '25'},
    {value: '26', viewValue: '26'},
    {value: '27', viewValue: '27'},
    {value: '28', viewValue: '28'},
    {value: '29', viewValue: '29'},
    {value: '30', viewValue: '30'},
    {value: '31', viewValue: '31'},
    {value: '32', viewValue: '32'},
    {value: '33', viewValue: '33'},
    {value: '34', viewValue: '34'},
    {value: '35', viewValue: '35'},
    {value: '36', viewValue: '36'},
    {value: '37', viewValue: '37'},
    {value: '38', viewValue: '38'},
    {value: '39', viewValue: '39'},
    {value: '40', viewValue: '40'},
    {value: '41', viewValue: '41'},
    {value: '42', viewValue: '42'},
    {value: '43', viewValue: '43'},
    {value: '44', viewValue: '44'},
    {value: '45', viewValue: '45'},
    {value: '46', viewValue: '46'},
    {value: '47', viewValue: '47'},
    {value: '48', viewValue: '48'},
    {value: '49', viewValue: '49'},
    {value: '50', viewValue: '50'},
    {value: '51', viewValue: '51'},
    {value: '52', viewValue: '52'},
    {value: '53', viewValue: '53'},
    {value: '54', viewValue: '54'},
    {value: '55', viewValue: '55'},
    {value: '56', viewValue: '56'},
    {value: '57', viewValue: '57'},
    {value: '58', viewValue: '58'},
    {value: '59', viewValue: '59'},
    {value: '60', viewValue: '60'},
    {value: '61', viewValue: '61'},
    {value: '62', viewValue: '62'},
    {value: '63', viewValue: '63'},
    {value: '64', viewValue: '64'},
    {value: '65', viewValue: '65'},
    {value: '66', viewValue: '66'},
    {value: '67', viewValue: '67'},
    {value: '68', viewValue: '68'},
    {value: '69', viewValue: '69'},
    {value: '70', viewValue: '70'},
    {value: '71', viewValue: '71'},
    {value: '72', viewValue: '72'},
    {value: '73', viewValue: '73'},
    {value: '74', viewValue: '74'},
    {value: '75', viewValue: '75'},
    {value: '76', viewValue: '76'},
    {value: '77', viewValue: '77'},
    {value: '78', viewValue: '78'},
    {value: '79', viewValue: '79'},
    {value: '80', viewValue: '80'},
    {value: '81', viewValue: '81'},
    {value: '82', viewValue: '82'},
    {value: '83', viewValue: '83'},
    {value: '84', viewValue: '84'},
    {value: '85', viewValue: '85'},
    {value: '86', viewValue: '86'},
    {value: '87', viewValue: '87'},
    {value: '88', viewValue: '88'},
    {value: '89', viewValue: '89'},
    {value: '90', viewValue: '90'},
    {value: '91', viewValue: '91'},
    {value: '92', viewValue: '92'},
    {value: '93', viewValue: '93'},
    {value: '94', viewValue: '94'},
    {value: '95', viewValue: '95'},
    {value: '96', viewValue: '96'},
    {value: '97', viewValue: '97'},
    {value: '98', viewValue: '98'},
    {value: '99', viewValue: '99'},
    {value: '100', viewValue: '100'},
  ];

  public ngOnInit() {
    this.tournamentService.getItems().subscribe(res => {
      console.log(res);
    });
    this.formTournament = this.formBuilder.group({
      name: ["", Validators.required],
      description: new FormControl(''),
      entryFee: ["", Validators.required],
      startDate: ["", Validators.required],
      prizeMoney: new FormControl(''),
      secondPrizeMoney: new FormControl(''),
      thirdPrizeMoney: new FormControl(''),
      numberOfPlayer: ["", Validators.required],
      banner: ["", Validators.required],
  })
  }
  onFileSelected(event) {

    const n = Date.now();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      this.imageSrc = reader.result as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        if( width !== 375 && height !== 500 ) {
          this.error = "photo should be 100 x 100 size"
          return;
       }
       this.spinner.show();
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
              this.formTournament.value.banner = this.fb;
            }
            this.spinner.hide();

            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
      this.error = '';
        console.log('Width and Height', width, height);
      };
    };
  }
  onSubmit() {
    console.log(this.formTournament.value);
    this.formTournament.markAllAsTouched();
    if (this.formTournament.invalid){
      return;
    }
    this.router.navigateByUrl('/tournament-list');
    this.formTournament.value.banner = this.fb;
    this.tournamentService.addTournament(this.formTournament.value).then(res => {
      console.log(res);
    })
  }
}
