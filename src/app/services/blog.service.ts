import { map, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Blog, BlogStatus } from '../models/blog';

export type BlogFilter = {
  status?: BlogStatus;
  author?: string;
  tags?: string[];
  searchText?: string;
  page?: number;
};

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

  public async saveBlog(blog: Blog, images: File[]) {
    const missingField = ['title', 'subtitle', 'headerImage'].find(
      (key) => !(blog as any)[key]
    );
    if (missingField) {
      this.notifications.addNotification(
        `${
          { title: 'Title', subtitle: 'Subtitle', headerImage: 'Header Image' }[
            missingField
          ]
        } is Required`,
        '',
        'danger'
      );
      return new Observable((observer) => {
        observer.next({ data: {} });
        observer.complete();
      });
    }

    const formData = this.jsonToFormData(blog);

    for (const image of images) {
      formData.append('images', image);
    }

    const requestOptions = {
      body: formData,
      nonJsonContent: true,
    };

    const blogResponse =
      blog.id !== 0
        ? await this.patch<Blog>(`/blog/${blog.id}`, requestOptions)
        : await this.post<Blog>('/blog', requestOptions);

    blogResponse.subscribe({
      error: (error) => {
        this.notifications.addNotification(
          'Blog Save Failed',
          error.error?.message ?? error.message ?? error.toString(),
          'danger'
        );
      },
    });

    return blogResponse;
  }

  public async getBlog(blogId: number, preview = false) {
    const blogResponse = await this.get<Blog>(
      `/blog/${blogId}${preview ? '/preview' : ''}`,
      { skipAuthorization: preview }
    );

    blogResponse.subscribe({
      error: (error) => {
        this.notifications.addNotification(
          'Get Blog Failed',
          error.error?.message ?? error.message ?? error.toString(),
          'danger'
        );
      },
    });

    return blogResponse;
  }

  public async getBlogs(isPublic = false, filter: BlogFilter = {}) {
    const blogsResponse = await this.get<Blog[]>(
      `/blog${isPublic ? '/public' : ''}`,
      { params: filter, skipAuthorization: isPublic }
    );

    blogsResponse.subscribe({
      error: (error) => {
        this.notifications.addNotification(
          'Get Blogs Failed',
          error.error?.message ?? error.message ?? error.toString(),
          'danger'
        );
      },
    });

    return blogsResponse;
  }

  private jsonToFormData(json: any) {
    const formData = new FormData();

    for (let key in json) {
      if (Array.isArray(json[key])) {
        json[key].forEach((value: any) => {
          formData.append(
            key,
            value && typeof value === 'object' ? JSON.stringify(value) : value
          );
        });
      } else {
        // Add simple properties directly to the FormData instance
        formData.append(key, json[key]);
      }
    }

    return formData;
  }
}
