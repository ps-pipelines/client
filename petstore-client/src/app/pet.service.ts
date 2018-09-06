import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pet } from './pet';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class PetService {

  private petsUrl = 'http://images:5000/api/images';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getPets (): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.petsUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getPetNo404<Data>(id: string): Observable<Pet> {
    const url = `${this.petsUrl}/?id=${id}`;
    return this.http.get<Pet[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} pet id=${id}`);
        }),
        catchError(this.handleError<Pet>(`getPet id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: string): Observable<Pet> {
    //const url = `${this.petsUrl}/${id}`;
    const url = `${this.petsUrl}/?id=${id}`;
    return this.http.get<Pet>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Pet>(`getpet id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchPets(term: string): Observable<Pet[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Pet[]>(`${this.petsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Pet[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addPet (pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.petsUrl, pet, httpOptions).pipe(
      tap((hero: Pet) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Pet>('addPet'))
    );
  }

  /** DELETE: delete the hero from the server */
  deletePet (pet: Pet | number): Observable<Pet> {
    const id = typeof pet === 'number' ? pet : pet.id;
    const url = `${this.petsUrl}/${id}`;

    return this.http.delete<Pet>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Pet>('deletePet'))
    );
  }

  /** PUT: update the hero on the server */
  updatePet (pet: Pet): Observable<any> {
    return this.http.put(this.petsUrl, pet, httpOptions).pipe(
      tap(_ => this.log(`updated pet id=${pet.id}`)),
      catchError(this.handleError<any>('updatePet'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PetService: ${message}`);
  }
}

