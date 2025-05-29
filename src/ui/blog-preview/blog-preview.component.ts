import { Component, computed, Input } from '@angular/core';
import { Blog } from '../../app/models/blog';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArchive,
  faCircle,
  faCircleCheck,
  faPencilAlt,
  faPlus,
  faShareAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { BlogService } from '../../app/services/blog.service';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NotificationService } from '../../app/services/notification.service';

@Component({
  selector: 'app-blog-preview',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ButtonComponent],
  templateUrl: './blog-preview.component.html',
  styleUrl: './blog-preview.component.css',
})
export class BlogPreviewComponent {
  faEdit = faPencilAlt;
  faCircle = faCircle;
  faPlus = faPlus;
  faShare = faShareAlt;

  faDelete = faTrashAlt;
  faArchive = faArchive;

  statusIcons = {
    DRAFT: faPencilAlt,
    ARCHIVED: faTrashAlt,
    PUBLISHED: faCircleCheck,
  };

  @Input() blog: Blog = null!;
  @Input() summary = true;
  @Input() showAllActions = false;

  readingTime = computed(() =>
    this.blogService.estimateReadingTime(this.blog?.content ?? [])
  );

  constructor(
    protected blogService: BlogService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  viewBlog() {
    this.router.navigateByUrl(`/blogs/${this.blog.id}`);
  }

  editBlog() {
    this.router.navigateByUrl(`/studio/blog?id=${this.blog.id}`);
  }

  shareBlog() {
    window.navigator
      .share({
        title: `${this.blog.title} | ${this.blog.author.displayName}`,
        text: this.blog.subtitle,
        url: `${environment.webBaseUrl}/blogs/${this.blog.id}`,
      })
      .catch((error) => {
        this.notificationService.addNotification(
          'Blog Share Failed',
          error.message,
          'danger'
        );
      });
  }

  deleteBlog() {
    console.log(`Delete Blog with ID: ${this.blog.id}`);
    // Logic to delete the blog
  }

  archiveBlog() {
    console.log(`Archive Blog with ID: ${this.blog.id}`);
    // Logic to archive the blog
  }
}
