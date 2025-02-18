import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private supaService: SupabaseService){}
  error: string | undefined;

  logout(){
    
    from( this.supaService.sendLogout())
    .subscribe(
      {
        next: (logindata) => console.log(logindata),
        complete: () => console.log('completed logout'),
        error: (error) => (this.error = error),
      }
    )

  }


}
