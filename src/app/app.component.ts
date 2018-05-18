import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public users = [
    {
      'id': 1,
      'name': 'User nr.1',
      'salary': '3000',
      'profession': 'driver'
    },
    {
      'id': 2,
      'name': 'User nr.2',
      'salary': '4000',
      'profession': 'teacher'
    },
    {
      'id': 3,
      'name': 'User nr.3',
      'salary': '4000',
      'profession': 'teacher'
    },
    {
      'id': 4,
      'name': 'User nr.4',
      'salary': '4000',
      'profession': 'constructor'
    }
  ];
  public usersCount = this.users.length;

  public loadUsers(e?) {
    this.users = this.users;
  }
}
