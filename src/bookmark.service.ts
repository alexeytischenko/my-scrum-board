import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class BookmarkService {

  errorHandler = error => console.error('BookmarkService error', error);
 // private baseUrl = 'https://a2-test-39d02.firebaseio.com';
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  
  constructor(private http: Http) { }

  addBookmark(bookmark) {
    const json = JSON.stringify(bookmark);
    return this.http.post(`${this.baseUrl}/tasks.json`, json)
      .toPromise()
      .catch(this.errorHandler);
  }

  getBookmarks() {
    return this.http.get(`${this.baseUrl}/tasks.json`)
      .toPromise()
      .then(response => this.convert(response.json()))
      .catch(this.errorHandler);
  }

  removeBookmark(bookmark) {
    return this.http.delete(`${this.baseUrl}/tasks/${bookmark.id}.json`)
      .toPromise()
      .catch(this.errorHandler);
  }

  updateBookmark(bookmark) {
    const json = JSON.stringify({
      title: bookmark.title,
      url: bookmark.url
    });
    return this.http.patch(`${this.baseUrl}/tasks/${bookmark.id}.json`, json)
      .toPromise()
      .catch(this.errorHandler);
  }

  private convert(parsedResponse) {
    return Object.keys(parsedResponse)
      .map(id => ({
        id: id,
        title: parsedResponse[id].title,
        url: parsedResponse[id].url
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

}
