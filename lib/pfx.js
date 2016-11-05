export default pfx => {
  const sep = `_`;

  const taskNameList = {
    $$: pfx
  };

  const setTaskName = name => {
    if(name === void 0)
      return pfx;
    if(taskNameList.hasOwnProperty(name)) {
      return taskNameList[name];
    }

    taskNameList[name] = pfx + sep + name;
    return pfx + sep + name;
  };

  setTaskName.has = name => taskNameList.hasOwnProperty(name);

  return setTaskName;
};