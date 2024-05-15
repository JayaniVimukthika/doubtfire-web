import {Component, Input, OnInit} from '@angular/core';
import {Task} from 'src/app/api/models/task';
import {TaskService} from 'src/app/api/services/task.service';

@Component({
  selector: 'f-task-scorm-card',
  templateUrl: './task-scorm-card.component.html',
  styleUrls: ['./task-scorm-card.component.scss'],
})
export class TaskScormCardComponent implements OnInit {
  @Input() task: Task;
  attemptsLeft: number;

  constructor(
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    if (this.task) {

    }
  }

  launchScormPlayer(): void {
    window.open(`#/task_def/${this.task.taskDefId}/task/${this.task.id}/scorm-player/normal`, '_blank');
  }

  requestMoreAttempts(): void {

  }
}
