import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { BlogPreviewComponent } from '../../ui/blog-preview/blog-preview.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlogContentBlockComponent } from '../../ui/blog-content-block/blog-content-block.component';
import { HljsComponent } from '../../ui/hljs-component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BlogPreviewComponent, CommonModule, BlogContentBlockComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent extends HljsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private meta: Meta,
    private titleService: Title
  ) {
    super();
  }

  blogId = 0;
  blog: Blog = null!;
  ngOnInit(): void {
    this.blogId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
    this.blogService.getBlog(this.blogId, true).then((blogResponse) => {
      blogResponse.subscribe({
        next: ({ data }) => {
          // handle meta tags
          const title = `${data.title} | ${data.author.displayName}`;
          this.titleService.setTitle(title);
          const tags = [
            { name: 'description', content: data.subtitle },
            { name: 'og:title', content: title },
            { name: 'og:description', content: data.subtitle },
            { name: 'og:image', content: data.headerImage },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: data.subtitle },
            { name: 'twitter:image', content: data.headerImage },
            { name: 'keywords', content: data.tags.join(',') },
          ];
          tags.forEach((tag) => this.meta.updateTag(tag));
          this.blog = {
            ...data,
            publishedDate: new Date(
              data.publishedDate ?? Date.now()
            ).toLocaleDateString('en-GB', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        },
      });
      if (isPlatformBrowser(this.platformId)) {
        this.blogService.getBlog(this.blogId).then((blogResponse) => {
          blogResponse.subscribe({
            next: ({ data }) => {
              this.blog = {
                ...data,
                publishedDate: new Date(
                  data.publishedDate ?? Date.now()
                ).toLocaleDateString('en-GB', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
              };
            },
          });
        });
      }
    });
  }
}
