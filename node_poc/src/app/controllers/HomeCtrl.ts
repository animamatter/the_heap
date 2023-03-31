// wiki.js - Wiki route module.
import { Router, Request, Response } from 'express';
import { BaseCtrl } from './BaseCtrl';

export class HomeCtrl extends BaseCtrl {
  constructor(router?: Router) {
    super(router);
    // Home page route.
    this.router.get('/', this.home);
    // About page route.
    this.router.get('/about', this.about);
  }

  home = (req: Request, res: Response) => res.send('Home page');
  about = (req: Request, res: Response) => res.send('About this project');
}
