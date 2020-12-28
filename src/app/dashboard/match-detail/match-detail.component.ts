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
import '../../../assets/smtp.js' 
import { MessagingService } from 'src/app/service/messaging.service';
declare let Email: any;

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './match-detail.component.html'
})
export class MatchDetailComponent implements OnInit {
  tournaments: any[] = [];
  item;
  formTournament: FormGroup;
  downloadURL: Observable<string>;
  fb;
  banner;
  matchId;
  singleItem;
  matches;
  maxMatch: any;
  match;
  tournamentId;
  user;
  userMatches;
  looser;
  users;
  userData;
  latestMatch: any;
  filteredMatches;
  arr: any[] = [];
  oneUser;
  latestUserMatch: any;
  tokenArray: any[] = [];
  userWithTokenArray: any[] = [];
  message: any;
  singleMatch: any;
  newMatchId: any;
  singleTournament: any;
  tournament: any;
  constructor(private tournamentService: TournamentService,
    private userService: UserService,
    private storage: AngularFireStorage,
    public route: ActivatedRoute,private messagingService: MessagingService,
    public firestore: AngularFirestore) {
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.matchId = params.id;
    });
    this.route.queryParams.subscribe((params) => {
      this.tournamentId = params.tournamentId;
    });
    this.matches = this.tournamentService.getMatches(this.tournamentId).subscribe((matches) => {
      this.item = matches.reduce((acc, curr) => {
        const id = curr.payload.doc.id;
        !(id in acc) && acc.push({
          id,
          ...curr.payload.doc.data()
        });
        return acc;
      }, []);

      this.maxMatch = Math.max.apply(Math, this.item.map(function(o) { return o.Match; }))

      this.latestMatch = this.item.find((match) =>{
        return match.Match == this.maxMatch;
      })

      this.tournamentService.getUserMatches(this.latestMatch.id).subscribe((res) => {
        this.latestUserMatch = res;

      })
      console.log(this.item, '============');
      this.singleItem = this.item.find((row) => {
        return row.id == this.matchId;
      });
      // this.tournamentService.getUser(this.singleItem.userId).subscribe((res: any) => {
      //   this.user = {
      //     id: res.payload.id,
      //     ...res.payload.data()
      //   };
      // })
      this.tournamentService.getUserMatches(this.matchId).subscribe((res) => {
        this.userMatches = res;

        this.filteredMatches = this.userMatches.filter((userMatch) => {
          return userMatch.matchId == this.matchId;
        })
        this.userService.getUsers().subscribe((users: any) => {
          this.users = users.map((arr) => {
            return {
              id: arr.payload.doc.id,
              ...arr.payload.doc.data()
            }
          })
          this.userData = this.users.map((user: any) => {
            return this.filteredMatches.map((userMatch: any) => {
              return user.id === userMatch.userId && !this.arr.some(a => a.id === user.id) && this.arr.push(user);
            })
          })
          this.users.map((data: any) => {
            if(data.deviceToken) {
              this.tokenArray.push(data.deviceToken);
              this.userWithTokenArray.push(data.id);
            }
          })
        })
      });
      this.tournamentService.getSingleMatch(this.tournamentId, this.matchId).subscribe((res: any) => {
        console.log(res);
        this.singleMatch = {
          id: res.payload.id,
          ...res.payload.data()
        };
      })
      this.tournamentService.getTournaments().subscribe((res) => {
        this.tournament = res.map((arr) => {
          return {
            id: arr.payload.doc.id,
            ...arr.payload.doc.data()
          }
        })
        this.singleTournament = this.tournament.find((row) => {
          return row.id == this.tournamentId;
        })
      });
    });
  }
  getUser(id: any) {
    this.tournamentService.getUser(id).subscribe((res: any) => {
      this.oneUser = {
        id: res.payload.id,
        ...res.payload.data()
      };
    })
    return this.oneUser;

    // return userData.filter((user) => {
    //   return user.id == id;
    // })
  }

  end() {
    if (this.singleMatch.bracket === 3) {
      this.tournamentService.winner(this.tournamentId, this.matchId, { endTournamentDate: Date.now() });
    }
  }

  winner(user: any) {
    console.log(this.arr);
    this.looser = this.arr.find((u: any) => {
      return u.id !== user.id;
    })
    this.tournamentService.winner(this.tournamentId, this.matchId, { userId: user.id, status: 'completed', winner: user.firstName });
    this.tournamentService.winUser(user.id, { wins: user.wins ? user.wins + 1 : 1  });
    if(this.looser) {
      this.tournamentService.winUser(this.looser.id, { loses: this.looser.loses ? this.looser.loses + 1 : 1  });
    }
    
    // if (this.singleMatch.bracket === 3) {
    //   this.tournamentService.winUser(user.id, { winnings: user.winnings ? user.winnings + this.singleTournament.prizeMoney : this.singleTournament.prizeMoney  });
    // }
    if (this.latestUserMatch.length === 2) {
      const matchDetail = {
        Match: this.maxMatch + 1,
        startTime: this.singleTournament.startDate,
        status: 'pending'
      }
      this.tournamentService.createMatch(this.tournamentId, matchDetail).then((res) => {
        this.newMatchId = res.id;
        console.log(res, 'kkkkkkkkkkkk');
        this.tournamentService.addUserMatches(user.id, this.newMatchId).then((res) => {
          console.log(res, 'kkkkkkkkkkkk');
        })
      })
    }

    if (this.latestUserMatch.length === 1) {
      this.tournamentService.addUserMatches(user.id, this.latestMatch.id).then((res) => {
        console.log(res, 'kkkkkkkkkkkk');
      })
    }


  
    this.sendNotification();
    setTimeout(() => {
      var that = this;
   
      that.tokenArray.map((token, i) => {

        this.messagingService.requestPermission(this.userWithTokenArray[i], { 
        title: 'Reminder',
        body: 'Reminder your match will start in next 3 minutes'
      });
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
        const payload = {
          notification: {
            title: 'Reminder',
        body: 'Reminder your match will start in next 3 minutes'
          },
          data: {
            type: "refresh_data"
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
    },420000);
    this.ngOnInit();
  }

  draw() {
    const d = new Date(Date.now());
    d.setSeconds(0, 0);
    const e = d.toISOString().replace(/:00.000Z/, "");;
    
    this.tournamentService.winner(this.tournamentId, this.matchId, { status: 'pending', startTime: e, proof1: '', proof2: '' });
    this.arr.map((user: any) => {
      this.tournamentService.winUser(user.id, { draws: user.draws ? user.draws + 1 : 1  });
    });

        this.tokenArray.map((token, i) => {

      this.messagingService.requestPermission(this.userWithTokenArray[i], { 
      title: 'Match Restarted',
      body: 'Your match has restarted'
    });
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      const payload = {
        notification: {
          title: 'Match Restarted',
          body: 'Your match has restarted'
        },
        data: {
          type: "refresh_data"
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

     setTimeout(() => {
      var that = this;
   
      that.tokenArray.map((token, i) => {

        this.messagingService.requestPermission(this.userWithTokenArray[i], { 
        title: 'Reminder',
        body: 'Reminder your match will start in next 3 minutes'
      });
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
        const payload = {
          notification: {
            title: 'Reminder',
        body: 'Reminder your match will start in next 3 minutes'
          },
          data: {
            type: "refresh_data"
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
    },420000);
  }

  tournamentWinner(user: any) {
    
    this.tournamentService.editTournament(this.tournamentId, { winnerId: user.id, open: false, endTournamentDate: Date.now()  });
    this.tournamentService.winner(this.tournamentId, this.matchId, { status: 'completed' });
    this.tournamentService.addChampion({tournamentId: this.tournamentId, tournamentTitle: this.singleTournament.name, tournamentDescription: this.singleTournament.description, tournamentStartDate: this.singleTournament.startDate, tournamentPrizePool: this.singleTournament.prizeMoney, winnerId: user.id, winnerName: user.firstName + ' ' + user.lastName, winnerImage: user.profilePic });
    this.tokenArray.map((token, i) => {

      this.messagingService.requestPermission(this.userWithTokenArray[i], { 
      
        title: 'Won the Tournament',
        body: 'Congratulations! You have won the tournament'
    });
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      const payload = {
        notification: {
          title: 'Won the Tournament',
          body: 'Congratulations! You have won the tournament'
        },
        data: {
          type: "refresh_data"
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

  sendNotification() {
    this.tokenArray.map((token, i) => {

      this.messagingService.requestPermission(this.userWithTokenArray[i], { 
      title: 'Winner',
      body: 'You have won the match'
    });
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      const payload = {
        notification: {
          title: 'Winner',
          body: 'You have won the match'
        },
        data: {
          type: "refresh_data"
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

  sendNotificationAfter() {
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
