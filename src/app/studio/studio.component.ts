import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArchive,
  faCheckCircle,
  faCircle,
  faPencilAlt,
  faPlus,
  faShareAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { BlogPreviewComponent } from '../../ui/blog-preview/blog-preview.component';
import { LoadingComponent } from '../../ui/loading/loading.component';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FontAwesomeModule,
    BlogPreviewComponent,
    LoadingComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
})
export class StudioComponent {
  blogs: Blog[] = [];
  loading = true;

  faEdit = faPencilAlt;
  faCircle = faCircle;
  faPlus = faPlus;
  faShare = faShareAlt;

  faDelete = faTrashAlt;
  faArchive = faArchive;

  statusIcons = {
    DRAFT: faPencilAlt,
    ARCHIVED: faTrashAlt,
    PUBLISHED: faCheckCircle,
  };

  platformId = inject(PLATFORM_ID);

  constructor(
    protected blogService: BlogService,
    protected userService: UserService,
    private router: Router
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.blogService.getBlogs().then((blogsResponse) => {
      blogsResponse.subscribe({
        next: ({ data }) =>
          (this.blogs = data.map((blog) => ({
            ...blog,
            publishedDate: new Date(
              new Date(blog.publishedDate || 0).valueOf() >
              new Date(0).valueOf()
                ? blog.publishedDate
                : new Date().toISOString()
            ).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
          }))),
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    });
  }

  createBlog() {
    this.router.navigateByUrl('/studio/blog');
  }
}
