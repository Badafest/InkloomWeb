import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../models/blog';
import { BlogFilter, BlogService } from '../services/blog.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArchive,
  faCheckCircle,
  faCircle,
  faPencilAlt,
  faPlus,
  faSearch,
  faShareAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { BlogPreviewComponent } from '../../ui/blog-preview/blog-preview.component';
import { LoadingComponent } from '../../ui/loading/loading.component';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BlogPreviewComponent,
    LoadingComponent,
    InputGroupComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css',
})
export class BlogListComponent {
  blogs: Blog[] = [];

  pageLoading = true;
  fetchingBlogs = false;

  faEdit = faPencilAlt;
  faCircle = faCircle;
  faPlus = faPlus;
  faShare = faShareAlt;

  faDelete = faTrashAlt;
  faArchive = faArchive;

  faSearch = faSearch;

  statusIcons = {
    DRAFT: faPencilAlt,
    ARCHIVED: faTrashAlt,
    PUBLISHED: faCheckCircle,
  };

  platformId = inject(PLATFORM_ID);

  filter: BlogFilter = {};

  protected async fetchBlogs() {
    this.fetchingBlogs = true;

    const blogsResponse = await this.blogService.getBlogs(true, this.filter);

    blogsResponse.subscribe({
      next: ({ data }) =>
        (this.blogs = data.map((blog) => ({
          ...blog,
          publishedDate: new Date(
            new Date(blog.publishedDate || 0).valueOf() > new Date(0).valueOf()
              ? blog.publishedDate
              : new Date().toISOString()
          ).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        }))),
      error: () => {
        this.fetchingBlogs = false;
        this.pageLoading = false;
      },
      complete: () => {
        this.fetchingBlogs = false;
        this.pageLoading = false;
      },
    });
  }

  constructor(
    protected blogService: BlogService,
    protected userService: UserService,
    private router: Router
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.fetchBlogs();
  }

  createBlog() {
    this.router.navigateByUrl('/studio/blog');
  }
}
