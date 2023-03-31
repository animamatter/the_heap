import express from 'express';
import bodyParser from 'body-parser';

import { BaseCtrl } from './controllers/BaseCtrl';

export class ServerApp {
  constructor(private app = express()) {
    //using the blody parser middleware
    this.app.use(bodyParser.json());
  }

  withController(ctrl: BaseCtrl, path?: string): ServerApp {
    if (path) this.app.use(path, ctrl.getRouter());
    else this.app.use(ctrl.getRouter());
    return this;
  }

  build(port: number) {
    // app server configurations
    this.app.listen(port, () => console.log(`listening on port ${port}`));
  }
}
