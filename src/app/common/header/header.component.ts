import { Component, Inject, OnInit } from '@angular/core';
import {
  aboutDoubtfireModal,
  calendarModal,
  userNotificationSettingsModal,
  userSettingsModal,
} from 'src/app/ajs-upgraded-providers';
import { CheckForUpdateService } from 'src/app/sessions/service-worker-updater/check-for-update.service';
import { GlobalStateService, ViewType } from 'src/app/projects/states/index/global-state.service';
import { IsActiveUnitRole } from '../pipes/is-active-unit-role.pipe';
import { UserService } from 'src/app/api/services/user.service';
import { Project, UnitRole, User } from 'src/app/api/models/doubtfire-model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  task: any;
  data: { isTutor: boolean } = {
    isTutor: false,
  };
  project: Project;
  unitRole: any = null;
  unitRoles: any;
  projects: Project[];
  filteredUnitRoles: UnitRole[];
  currentUnitOrProject: any;
  currentView: ViewType;
  showHeader: boolean = true;
  constructor(
    @Inject(userSettingsModal) private UserSettingsModal,
    @Inject(userNotificationSettingsModal) private UserNotificationSettingsModal,
    @Inject(calendarModal) private CalendarModal,
    @Inject(aboutDoubtfireModal) private AboutDoubtfireModal,
    private isActiveUnitRole: IsActiveUnitRole,
    private checkForUpdateService: CheckForUpdateService,
    private globalState: GlobalStateService,
    private userService: UserService
  ) {

    this.globalState.showHideHeader.subscribe({
      next: (shouldShow) => {
        this.showHeader = shouldShow;
      },
      error: (err) => {},
    });

    this.globalState.unitRolesSubject.subscribe({
      next: (unitRoles) => {
        if (unitRoles == null) return; // might be signing out, or the data has been cleared
        this.unitRoles = unitRoles;

        this.filteredUnitRoles = this.isActiveUnitRole
          .transform(this.unitRoles)
          .filter((role) => this.isUniqueRole(role));
        console.log(this.filteredUnitRoles);
      },
      error: (err) => {},
    });

    this.globalState.projectsSubject.subscribe({
      next: (projects) => {
        if (projects == null) return;
        this.projects = projects;
      },
      error: (err) => {},
    });

    // get the current active unit or project
    this.globalState.currentViewAndEntitySubject.subscribe({
      next: (currentViewAndEntity) => {
        this.currentView = currentViewAndEntity?.viewType;

        if (this.currentView == ViewType.PROJECT) {
          this.updateSelectedProject(currentViewAndEntity.entity);
        } else if (this.currentView == ViewType.UNIT) {
          this.updateSelectedUnitRole(currentViewAndEntity.entity);
        } else {
          this.currentUnitOrProject = null;
        }
      },
      error: (err) => {},
    });
  }

  isUniqueRole = (unit) => {
    let units = this.unitRoles.filter((role: any) => role.unit.id === unit.unit.id);
    return units.length == 1 || unit.role == 'Tutor';
  };

  updateSelectedProject(project) {
    this.currentUnitOrProject = {
      project_id: project.id,
      unit_id: project.unit.id,
      code: project.unit.code,
      name: project.unit.name,
      role: project.myRole || 'Unknown',
    };
    this.project = project;
    this.updateTutor();
  }

  updateSelectedUnitRole(unitRole) {
    this.currentUnitOrProject = {
      code: unitRole.unit.code,
      name: unitRole.unit.name,
      role: unitRole.role || 'Unknown',
    };
    this.unitRole = unitRole;
    this.updateTutor();
  }

  updateTutor() {
    this.data.isTutor =
      this.project != null &&
      (this.currentUnitOrProject.role === 'Convenor' ||
        this.currentUnitOrProject.role === 'Tutor' ||
        this.currentUnitOrProject.role === 'Admin');
  }

  openUserSettings() {
    this.UserSettingsModal.show(this.currentUser);
  }

  openNotificationSettings() {
    this.UserNotificationSettingsModal.show(this.currentUser);
  }

  update() {
    this.checkForUpdateService.checkForUpdate();
  }

  openAboutModal() {
    this.AboutDoubtfireModal.show();
  }

  openCalendar() {
    this.CalendarModal.show();
  }

  get currentUser(): User {
    return this.userService.currentUser;
  }

  ngOnInit(): void {}
}
