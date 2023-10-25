const ProcessService = (() => {
  let instance = null;

  const init = () => ({
    processes: {},
  });

  const deleteProcess = ({ id }) => {
    if (!instance.processes[id]) {
      return;
    }

    delete instance[id];
  };

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('ProcessService service not initialized');
      }

      return instance;
    },
    initialize: () => {
      instance = init();

      return instance;
    },
    deleteProcess: ({ id }) => deleteProcess({ id }),
    updateProcess: ({ id, params, params: { progressValue } = {} } = {}) => {
      const progressValueRounded = Math.round(progressValue);

      if (instance.processes[id]?.callback && progressValueRounded !== instance.processes[id].progressValue) {
        instance.processes[id].callback(instance.processes[id]);
      }

      instance.processes[id] = {
        id,
        ...(instance.processes[id] || {}),
        ...params,
        progressValue: progressValueRounded,
      };

      if (progressValueRounded === 100) {
        deleteProcess({ id });
      }
    },
    setProcess: ({ id, params } = {}) => {
      instance.processes[id] = {
        id,
        ...(instance.processes[id] || {}),
        ...params,
      };
    },
  };
})();

export default ProcessService;
