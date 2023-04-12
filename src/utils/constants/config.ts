// mode
export const ENV: string = process.env.REACT_APP_NODE_ENV || "development";
export const MODE_DEBUG: boolean = ENV !== "production";