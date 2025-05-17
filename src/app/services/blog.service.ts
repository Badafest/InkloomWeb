import { map, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Service is registered in root module and available app-wide
})
export class BlogService extends ApiService {
  // private _userService = inject(UserService);
  private _tagsDestoyer = new Subject<void>();

  public async getTags(search: string) {
    this._tagsDestoyer.next();
    this._tagsDestoyer.complete();

    if (search.length < 2) {
      return new Observable<{ data: string[] }>((observer) => {
        observer.next({ data: [] });
        observer.complete();
      });
    }

    const tagResponse = (
      await this.get<string[]>(`tag?name=${search}`, {
        destroyer: this._tagsDestoyer,
      })
    ).pipe(
      map(({ data }) => ({
        data: Array.from(new Set([search, ...data])).sort(
          (a, b) => a.indexOf(search) + a.length - b.indexOf(search) - b.length
        ),
      }))
    );

    tagResponse.subscribe({
      error: (error) => {
        this.notifications.addNotification(
          'Tag Fetch Failed',
          error.error?.message ?? error.message ?? error.toString(),
          'danger'
        );
      },
    });

    return tagResponse;
  }
}
