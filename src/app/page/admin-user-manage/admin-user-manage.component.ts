import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsermanagementService } from 'app/service/Usermanagement/usermanagement.service';
import { Router } from '@angular/router';

interface UserPayment {
  Order : number;
  UserID : number;
  Username : string;
  FirstName : string;
  LastName : string;
  Telephone : string;
  Tier : string;
  SubmissionDate : Date;
  Verified : boolean;

}

@Component({
  selector: 'app-admin-user-manage',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './admin-user-manage.component.html',
  styleUrl: './admin-user-manage.component.css'
})
export class AdminUserManageComponent {
  UserList!: UserPayment[];
  formattedData !: UserPayment[];
  displayedColumns: string[] = ['Order', 'UserID','Username', 'Name', 'Telephon','Tier','SubmissionDate','Verified'];
  dataSource = new MatTableDataSource<UserPayment>(this.UserList);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading:boolean=true;

  constructor(private UMService: UsermanagementService, private router:Router) { }


  ngOnInit(): void {
  this.UMService.getuserList().subscribe({
        next: (response) => {
          this.UserList = response;
          this.formattedData = this.UserList.map((user, index) => ({
            ...user,
            Order: index + 1 // Assign order sequentially starting from 1
          }));
      
          this.dataSource = new MatTableDataSource<UserPayment>(this.formattedData);
          this.dataSource.paginator = this.paginator;
          console.log(this.formattedData);
          this.loading = false
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }

  userClicked(userID: number) {

    this.router.navigate(['UserPaymentManage', userID]);
    
  }

  searchUser(event: any) {
    const searchValue = (event.target as HTMLInputElement).value;
    if(searchValue){
    const searchList = this.formattedData.filter((user) => 
      user.Username.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.FirstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.LastName.toLowerCase().includes(searchValue.toLowerCase())
    );
    this.dataSource = new MatTableDataSource<UserPayment>(searchList);
  }
  else{
    this.dataSource = new MatTableDataSource<UserPayment>(this.formattedData);
  }
  this.dataSource.paginator = this.paginator;
}
}
