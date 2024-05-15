import {Component, OnInit, Input} from '@angular/core';
import {Task, TaskComment} from 'src/app/api/models/doubtfire-model';

@Component({
  selector: 'scorm-comment',
  templateUrl: './scorm-comment.component.html',
  styleUrls: ['./scorm-comment.component.scss'],
})
export class ScormCommentComponent implements OnInit {
  @Input() task: Task;
  @Input() comment: TaskComment;

  constructor() {}

  ngOnInit() {}

  reviewScormTest() {
    window.open(`#/task_def/${this.task.taskDefId}/task/${this.task.id}/scorm-player/review`, '_blank');
  }
}
