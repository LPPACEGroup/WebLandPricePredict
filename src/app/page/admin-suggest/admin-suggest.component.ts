import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SuggestionService } from 'app/service/sugesstion/suggestion.service';
import { Suggestion } from 'model/suggestion.interface';
@Component({
  selector: 'app-admin-suggest',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './admin-suggest.component.html',
  styleUrl: './admin-suggest.component.css',
})
export class AdminSuggestComponent {
  userSuggestions!: Suggestion[];
  displayedColumns: string[] = ['CommentID', 'UserID', 'Content', 'Date','Delete'];
  dataSource = new MatTableDataSource<Suggestion>(this.userSuggestions);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  constructor(private suggestionService: SuggestionService) {
    this.fetchSuggestions();
  }

  ngOnInit(): void {

  }
  
  deleteSuggestion(id: number) {
    console.log('delete suggestion id: ', id);
    this.suggestionService.deleteSuggestion(id).subscribe({
      next: () => {
        this.fetchSuggestions();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.fetchSuggestions();
  }

  fetchSuggestions() {
    this.suggestionService.getSuggestions().subscribe({
      next: (response) => {
        this.userSuggestions = response;
        this.dataSource = new MatTableDataSource<Suggestion>(this.userSuggestions);
        this.dataSource.paginator = this.paginator;

      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }
}
