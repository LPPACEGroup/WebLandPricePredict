import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';



interface UserProfile {
avatarUrl: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  interests: string[];
  tier: string;
  paymentDate: string;
}


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [MatIconModule, CommonModule,],

  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})

export class ProfilePageComponent implements OnInit {

  sEditing = false;
  profileForm: FormGroup;

  profile: UserProfile = {
    id: 'นาตาลี24',
    name: 'นางสาวนาตาลี สุรินสา',
    email: 'registrar@kmitl.ac.th',
    phone: '099-984-2350',
    address: '173 / 103 หมู่ 4 หมู่บ้านบางปลาร้องเรียง',
    district: 'บ้านเกาะ',
    province: 'สมุทรสาคร',
    postalCode: '74000',
    interests: ['ที่ดินติดถนน', 'ที่ดินใกล้ตัวเมือง', 'ที่ดินภายในเขตอุตสาหกรรม'],
    tier: 'Tier 1',
    paymentDate: 'ชำระเงินแล้ว เมื่อวันที่ 23/4/2022 เวลา 3.50 PM',
    avatarUrl: undefined
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      district: [''],
      amphur: [''],
      province: [''],
      postalCode: ['']
    });
  }

  ngOnInit() {
    this.resetForm();
  }

  startEditing() {
    this.sEditing = true;
    this.resetForm();
  }

  cancelEdit() {
    this.sEditing = false;
    this.resetForm();
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.profile = { ...this.profileForm.value };
      this.sEditing = false;
    }
  }


  private resetForm() {
    this.profileForm.patchValue({
      id: this.profile.id,
      name: this.profile.name,
      email: this.profile.email,
      phone: this.profile.phone,
      address: this.profile.address,
      district: this.profile.district,
      province: this.profile.province,
      postalCode: this.profile.postalCode
    });
  }

}
