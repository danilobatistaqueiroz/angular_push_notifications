import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PushService } from './push.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  providers: [PushService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pusher';

  pushService = inject(PushService);

}
