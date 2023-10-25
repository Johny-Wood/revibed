import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { ProjectsLocationsConstants } from '@/constants/projects/location';

export const ProjectsNotificationLocationsConstants = [
  ProjectsLocationsConstants.MY_PROJECTS,
  ProjectsLocationsConstants.IN_MODERATION,
  ProjectsLocationsConstants.NEW_ARRIVALS,
];

export const NotificationsDependenceProjectLocationsConstants = [
  PersonalNotificationsSectionsConstants.MY_PROJECTS,
  PersonalNotificationsSectionsConstants.IN_MODERATION,
  PersonalNotificationsSectionsConstants.NEW_ARRIVALS,
  PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED,
  PersonalNotificationsSectionsConstants.PROJECTS_EVENTS,
  PersonalNotificationsSectionsConstants.CUSTOM_FEED,
];
