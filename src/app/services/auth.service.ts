import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../models/app-user.model';
import { UserService } from './user.service';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;
  
  constructor(
    private angularFireAuth: AngularFireAuth, 
    private route: ActivatedRoute,
    private userService: UserService
  ) { 
    this.user$ = angularFireAuth.authState;
    
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.angularFireAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }

  get appUser$(): Observable<AppUser> {
    // switchMap is like regular map, but only it switches to the newly created observable
    return this.user$.switchMap(user => {
      if (user) return this.userService.get(user.uid);

      return Observable.of(null);
    })
  }

}
