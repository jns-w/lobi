import {closeMongo} from "../db/config";

export function setListeners() {
  console.log("Setting listeners");
  process.on('SIGINT', async () => {
    console.log("Caught interrupt signal");
    await closeMongo().then(() => {
      process.exit(0);
    }).catch(err => console.log(err))
  });
}