import AllProjectsHandler from './handler/AllProjectsHandler';

const handlers = [new AllProjectsHandler()];

export default class VideoPlayerAsyncStateChangedHandler {
  // eslint-disable-next-line class-methods-use-this
  handle = ({ activeLocation, status, index, callback }) => {
    handlers.forEach((handler) => {
      if (handler.supportedLocations().includes(activeLocation)) {
        handler.handle({ activeLocation, status, index, callback });
      }
    });
  };
}
