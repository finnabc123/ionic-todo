import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public title: string = 'To Do'
  public workName: string = ''
  private editWorkId: number = 0;
  public items: ITodos[] = [];
  public showCancel: boolean = false;

  constructor() { }

  async ionViewWillEnter() {
    await this.getWorks();
  }

  public async onEditing(item: ITodos): Promise<void> {
    this.showCancel = true;
    this.editWorkId = item.id;
    this.workName = item.todoName;
  }


  public async onDeleting(item: ITodos): Promise<void> {
    this.showCancel = false;
    this.editWorkId = 0;
    this.items = this.items.filter(i => i.id !== item.id);
    await this.setWorks()
  }

  public async onAddWork(work: string): Promise<void> {
    if (this.editWorkId) {
      this.items.find((itm, indx) => {
        if (itm.id === this.editWorkId) {
          this.items[indx].todoName = work;
          this.editWorkId = 0;
          this.showCancel = false;
        }
      });
    } else {
      this.editWorkId = 0;
      this.items.unshift({
        id: + (Math.random().toString().replace('.', '')),
        todoName: work,
        isChecked: false,
        dueDate: new Date()
      });
    }
    setTimeout(async () => {
      this.workName = '';
      await this.setWorks()
    }, 100);
  }

  public onCancelWork() {
    this.workName = '';
    this.editWorkId = 0;
    this.showCancel = !this.showCancel;
  }

  private async setWorks(): Promise<void> {
    await Storage.set({
      key: 'work',
      value: JSON.stringify(this.items)
    });
  }


  async getWorks(): Promise<void> {
    const ret = await Storage.get({ key: 'work' });
    const works = JSON.parse(ret.value);
    this.items = works;
  }

  showDateLavel(indx: number, item: ITodos): boolean {
    if (indx > 0 && this.items.length > 1) {
      if (this.isSameDay(indx, item.dueDate)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  private isSameDay(indx: number, d: Date): boolean {
    d = new Date(d);
    const pd = new Date(this.items[indx - 1].dueDate);
    return d.getDate() === pd.getDate() &&
      d.getMonth() === pd.getMonth() &&
      d.getFullYear() === pd.getFullYear()
  }

  public disableButton(d: Date): boolean {
    const today = new Date();
    const pd = new Date(d);
    return today.getDate() > pd.getDate() &&
      today.getMonth() >= pd.getMonth() &&
      today.getFullYear() >= pd.getFullYear()
  }

}


interface ITodos {
  id: number
  todoName: string,
  isChecked: boolean,
  dueDate: Date
}
