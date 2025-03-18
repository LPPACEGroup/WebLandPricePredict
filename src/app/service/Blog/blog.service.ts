import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Blog } from 'model/blog.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiURL = environment.BE_URL;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiURL}/blog`, { withCredentials: true });
  }

  createBlog(blog: Blog): Observable<any> {
    return this.http.post(`${this.apiURL}/blog`, blog, {
      withCredentials: true,
    });
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/blog/${id}`, {
      withCredentials: true,
    });
  }

  updateBlog(blog_id: number, blog: Blog): Observable<any> {
    return this.http.put(`${this.apiURL}/blog/${blog_id}`, blog, {
      withCredentials: true,
    });
  }

  getNews(number:number): Observable<any> {
    return this.http.get(`${this.apiURL}/news/${number}`, { withCredentials: true });
  }

}
