import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { BlogService } from 'app/service/Blog/blog.service';
import { NotislotComponent } from 'app/core/notislot/notislot.component';
import { Output } from '@angular/core';

@Component({
  selector: 'app-noti',
  standalone: true,
  imports: [CommonModule, NotislotComponent],
  templateUrl: './noti.component.html',
  styleUrl: './noti.component.css'
})
export class NotiComponent {
  news: any[] = [];
  readNews: Set<number> = new Set();
  hasUnreadNews: boolean = false; // Track if there are unread news
  @Output() unreadNews = new EventEmitter<boolean>();

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadReadNews();
    this.blogService.getNews(3).subscribe((data) => {
      this.news = data;
      
      this.checkUnreadNews();
    });
  }

  private loadReadNews() {
    const storedReadNews = localStorage.getItem('readNews');
    if (storedReadNews) {
      this.readNews = new Set(JSON.parse(storedReadNews));
      
    }
  }

  private checkUnreadNews() {
    this.hasUnreadNews = this.news.some(item => !this.readNews.has(item.NewsID));
    
    this.unreadNews.emit(this.hasUnreadNews);
  }

  markAllAsRead() {
    this.news.forEach(item => this.readNews.add(item.NewsID));
    
    localStorage.setItem('readNews', JSON.stringify([...this.readNews]));
    
    
    this.hasUnreadNews = false; // Since all are now read
    
  }

  private isRead(newsId: number): boolean {
    return this.readNews.has(newsId);
  }
}
