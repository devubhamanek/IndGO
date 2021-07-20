import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {Configuration} from './app.configuration';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public _config: Configuration, private router: Router) { }

    canActivate() {
        // Check to see if a user has a valid JWT
        if (tokenNotExpired(this._config._tokenIdentifier)) {
            // If they do, return true and allow the user to load the home component
            return true;
        }

        // If not, they redirect them to the login page
        this.router.navigate(['']);
        return false;
    }

    logout() {

        localStorage.removeItem(this._config._tokenIdentifier);
        localStorage.removeItem(this._config._userGuidIdentifier);
        localStorage.removeItem(this._config._userIdIdentifier);

        this.router.navigateByUrl('login');
    }

    // Finally, this method will check to see if the user is logged in. We'll be able to tell by checking to see if they have a token and whether that token is valid or not.
    loggedIn() {
        return tokenNotExpired(this._config._tokenIdentifier);
    }
}