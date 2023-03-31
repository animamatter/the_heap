// wiki.js - Wiki route module.
import express, { Router } from 'express';

export class BaseCtrl {
  constructor(public router: Router = express.Router()) {}

  getRouter(): Router {
    return this.router;
  }
}
