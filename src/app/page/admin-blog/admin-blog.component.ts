import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BlogService } from 'app/service/Blog/blog.service';
import { Blog } from 'model/blog.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';



interface BlogData {
  ID: number;
  Topic: string;
  Date: string;
  Content: string;
  index?: number; // Add index property
}

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule,ReactiveFormsModule],
  templateUrl: './admin-blog.component.html',
  styleUrl: './admin-blog.component.css'
})
export class AdminBlogComponent {

  blogList :BlogData [] = [];
  searchBlogList :BlogData [] = [];
  displayedColumns: string[] = ['Order', 'ID', 'Topic', 'Content','Edit','Delete'];
  dataSource = new MatTableDataSource<BlogData>(this.blogList);
  createBlogForm: FormGroup;
  editBlogForm: FormGroup;
  selectedEditID!:number ;
  selectedDeleteID!:number ;
  expandedElement: BlogData | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  constructor(private blogService:BlogService ,private fb :FormBuilder) {
    this.createBlogForm = this.fb.group({
      Topic: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Content: new FormControl('', Validators.required),

    });
    this.editBlogForm = this.fb.group({
      Topic: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Content: new FormControl('', Validators.required),
    });
   }

  ngOnInit(): void {
    this.fetchBlogs();
    
  }

  onSubmit() {
    const newBlog: Blog = {
      ID: 0,
      Topic: this.createBlogForm.get('Topic')?.value,
      Content: this.createBlogForm.get('Content')?.value,
      CreateDate: new Date().toISOString()
    }
    
    this.blogService.createBlog(newBlog).subscribe({
      next: (response) => {
        console.log('Create Blog:', response);
        this.fetchBlogs();
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.createBlogForm.reset();
  }

  deleteBlog(){
    const id = this.selectedDeleteID;
    this.blogService.deleteBlog(id).subscribe({
      next: (response) => {
        console.log('Delete Blog:', response);
        this.fetchBlogs();
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.selectedDeleteID = -1;

  }
  editBlog(){
    if (this.selectedEditID && this.editBlogForm.valid) {
      const editedBlog: Blog = {
        ID: this.selectedEditID,
        Topic: this.editBlogForm.get('Topic')?.value,
        Content: this.editBlogForm.get('Content')?.value,
        CreateDate: new Date().toISOString()
      }
      this.blogService.updateBlog(this.selectedEditID, editedBlog).subscribe({
        next: (response) => {
          console.log('Edit Blog:', response);
          this.fetchBlogs();
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
      this.selectedEditID = -1;
      this.editBlogForm.reset();
    }
  }
  onEditClick(id:number){
    this.selectedEditID = id;
    const model = document.getElementById('edit_blog_modal') as HTMLDialogElement;
    this.editBlogForm.setValue({
      Topic: this.blogList.find(blog => blog.ID === id)?.Topic,
      Content: this.blogList.find(blog => blog.ID === id)?.Content
    });
    model?.showModal();

  }
  onDeleteClick(id:number){
    this.selectedDeleteID = id;
    const model = document.getElementById('confirm_delete') as HTMLDialogElement;
    model?.showModal();

  }

  fetchBlogs() {
    this.blogService.getBlogs().subscribe({
      next: (response) => {
        this.blogList = response;
  
        // Update indexes based on the actual position in the array
        this.blogList.forEach((blog, index) => {
          blog.index = index + 1;
        });
  
        const previousExpanded = this.expandedElement; // Preserve the expanded element
        this.dataSource = new MatTableDataSource<BlogData>(this.blogList);
        this.dataSource.paginator = this.paginator;
  
        // Restore expanded state if applicable
        if (previousExpanded) {
          this.expandedElement = this.blogList.find(
            blog => blog.ID === previousExpanded.ID
          ) || null;
        }
  
        const searchInput = document.getElementsByClassName('search_blog')[0] as HTMLInputElement;
        if (searchInput) {
          searchInput.value = '';
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }
  
  toggleRow(row: BlogData) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }
  
  searchBlog(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    if (searchValue) {
      this.searchBlogList = this.blogList.filter(blog => 
        blog.Topic.includes(searchValue) || 
        blog.Content.includes(searchValue)
      );
      this.dataSource = new MatTableDataSource<BlogData>(this.searchBlogList);
    } else {
      this.dataSource = new MatTableDataSource<BlogData>(this.blogList);
    }
    this.dataSource.paginator = this.paginator;
  }

getRowIndex(element: BlogData): number {
  const index = this.dataSource.filteredData.indexOf(element);
  if (this.paginator) {
    return index + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }
  return index + 1;
}


}
