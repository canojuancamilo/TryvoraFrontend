import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityService } from '../../../core/services/activity.service';

@Component({
  selector: 'app-activity-feed',
  imports: [],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeed {
   private activityService = inject(ActivityService);
  activities = this.activityService.activities;
 }
