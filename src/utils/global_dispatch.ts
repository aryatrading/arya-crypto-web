let dispatch: any = null;

export const setDispatch = (_dispatch: any) => {
  dispatch = _dispatch;
};

export const dispatchAction = (action: any) => {
  dispatch(action);
};
