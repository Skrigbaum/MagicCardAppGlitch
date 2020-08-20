import { Component, OnInit, Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

@Injectable()
export class CardComponent implements OnInit {
  constructor(private http: HttpClient) { }

  types = {
    problem: "t:Creature+OR+t:enchantment+OR+t:conspiracy+OR+t:Phenomenon+OR+t:Planeswalker+OR+t:Vanguard",
    setting: "t:land",
    solution: "t:Artifact+OR+t:Sorcery",
    antagonist: "t:Creature+OR+t:PlanesWalker",
    helper: "t:Creature+OR+t:PlanesWalker"
  };
  
  cards = {
    problem: 'problem',
    setting: 'setting',
    solution: 'solution',
    antagonist: 'antagonist',
    helper: 'helper',
  };

  async ngOnInit() {
    for (const card in this.cards) {
      await this.getCards(this.cards[card]);
    }
  }

  async getCards(cardType: string) {
    let searchType = this.types[cardType];

    if (cardType == null || cardType == '') {
      let returnedCard = this.http
        .get<any>(`https://api.scryfall.com/cards/random`)
        .pipe(
          catchError(this.handleError)
        )
        this.cards[cardType] = await this.getCardImage(returnedCard);
    } else {
      let returnedCard = this.http
        .get<any>(`https://api.scryfall.com/cards/random?q=${searchType}`)
        .pipe(
          catchError(this.handleError)
        )

        this.cards[cardType] = await this.getCardImage(returnedCard);
    }
  }

  async getCardImage(card: Observable<any>) {
    const x = await card.toPromise();
    return x.image_uris.normal || x.image_uris.small;
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it   accordingly.
      console.error('An error occurred:',   errorResponse.error.message);
    } 
   else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        'Backend returned code ${errorResponse.status}, '+
        'body was: ${errorResponse.error}');
    }    // return an observable with a user-facing error message
    return throwError(
      'Error Occurred; please try again later.');
  };

}
